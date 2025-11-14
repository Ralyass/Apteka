using AptekaTest.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AptekaTest.Server.Services
{
    public class OrderService
    {
        private readonly MyDbContext _context;

        public OrderService(MyDbContext context)
        {
            _context = context;
        }

        // --- To jest najważniejsza metoda w Twojej aplikacji ---
        public async Task<Orders> CreateOrderAsync(CreateOrderRequest request)
        {
            // Używamy transakcji, aby upewnić się, że cała operacja
            // (stworzenie paragonu ORAZ zmniejszenie stanu) uda się, albo nic się nie stanie.
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // 1. Stwórz nowy, pusty paragon
                    var order = new Orders
                    {
                        Date = DateTime.UtcNow,
                        TotalAmount = 0 // Na razie 0
                    };
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync(); // Zapisz, aby dostać 'order.Id'

                    decimal calculatedTotal = 0;

                    // 2. Przejdź przez każdy produkt w koszyku
                    foreach (var item in request.CartItems)
                    {
                        // 3. Znajdź lek w bazie danych
                        var medicine = await _context.Medicines.FindAsync(item.MedicineId);

                        // 4. Walidacja: Sprawdź, czy lek istnieje i czy mamy go na stanie
                        if (medicine == null)
                        {
                            throw new Exception($"Lek o ID {item.MedicineId} nie istnieje.");
                        }
                        if (medicine.Quantity < item.Quantity)
                        {
                            throw new Exception($"Niewystarczająca ilość leku '{medicine.Name}'. Dostępne: {medicine.Quantity}, Wymagane: {item.Quantity}.");
                        }

                        // 5. 🔑 KLUCZOWA LOGIKA: Zmniejsz stan magazynowy
                        medicine.Quantity -= item.Quantity;
                        _context.Medicines.Update(medicine);

                        // 6. Stwórz nową "linijkę na paragonie"
                        var orderItem = new OrderItem
                        {
                            OrderId = order.Id,
                            MedicineId = medicine.Id,
                            Quantity = item.Quantity,
                            Price = medicine.Price // Zapisz cenę z momentu sprzedaży
                        };
                        _context.OrderItems.Add(orderItem);

                        // 7. Zaktualizuj sumę paragonu
                        calculatedTotal += (medicine.Price * item.Quantity);
                    }

                    // 8. Zapisz ostateczną sumę na paragonie
                    order.TotalAmount = calculatedTotal;
                    _context.Orders.Update(order);

                    // 9. Zapisz WSZYSTKIE zmiany (zmniejszony stan, nowe OrderItems, zaktualizowany Order)
                    await _context.SaveChangesAsync();

                    // 10. Zatwierdź transakcję
                    await transaction.CommitAsync();

                    return order; // Zwróć gotowy paragon
                }
                catch (Exception)
                {
                    // 11. Jeśli wystąpił jakikolwiek błąd, wycofaj wszystkie zmiany
                    await transaction.RollbackAsync();
                    throw; // Rzuć błędem dalej, aby kontroler go złapał
                }
            }
        }

        // Metoda do przeglądania historii zamówień (dla Kierownika/Admina)
        public async Task<List<Orders>> GetAllOrdersAsync()
        {
            // Dołączamy 'OrderItems', a następnie 'Medicine', aby wiedzieć, co było w zamówieniu
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .ToListAsync();
        }
    }
}