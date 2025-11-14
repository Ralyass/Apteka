using AptekaTest.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AptekaTest.Server.Services
{
    public class MedicineService
    {
        private readonly MyDbContext _context;

        public MedicineService(MyDbContext context)
        {
            _context = context;
        }

        // Używamy async/await dla lepszej wydajności
        public async Task<List<Medicine>> GetAllMedicinesAsync()
        {
            return await _context.Medicines.ToListAsync();
        }

        public async Task<Medicine> GetMedicineByIdAsync(int id)
        {
            return await _context.Medicines.FindAsync(id);
        }

        public async Task<Medicine> AddMedicineAsync(Medicine medicine)
        {
            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();
            return medicine;
        }

        public async Task<bool> UpdateMedicineAsync(Medicine medicine)
        {
            // Oznaczamy obiekt jako zmodyfikowany
            _context.Entry(medicine).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMedicineAsync(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null)
            {
                return false; // Nie znaleziono
            }

            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}