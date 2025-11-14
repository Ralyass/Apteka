using AptekaTest.Server.Models;
using AptekaTest.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AptekaTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // 🔑 WAŻNE: Cały ten kontroler wymaga, aby użytkownik był ZALOGOWANY.
    // Ale poszczególne metody będą miały BARDZIEJ rygorystyczne wymagania.
    [Authorize]
    public class MedicinesController : ControllerBase
    {
        private readonly MedicineService _medicineService;

        public MedicinesController(MedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        // GET /api/medicines
        // 🔑 Pozwalamy KAŻDEMU zalogowanemu (Admin, Kierownik, Farmaceuta)
        // na PRZEGLĄDANIE listy leków.
        [HttpGet]
        [Authorize(Roles = "Admin,Kierownik,Farmaceuta")]
        public async Task<ActionResult<List<Medicine>>> Get()
        {
            return await _medicineService.GetAllMedicinesAsync();
        }

        // GET /api/medicines/5
        // 🔑 To samo - każdy zalogowany może pobrać szczegóły
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Kierownik,Farmaceuta")]
        public async Task<ActionResult<Medicine>> Get(int id)
        {
            var medicine = await _medicineService.GetMedicineByIdAsync(id);
            if (medicine == null)
                return NotFound();
            return medicine;
        }

        // POST /api/medicines
        // 🔑 TYLKO Admin lub Kierownik mogą DODAWAC nową pozycję do katalogu.
        [HttpPost]
        [Authorize(Roles = "Admin,Kierownik")]
        public async Task<ActionResult<Medicine>> Post([FromBody] Medicine medicine)
        {
            var createdMedicine = await _medicineService.AddMedicineAsync(medicine);
            return CreatedAtAction(nameof(Get), new { id = createdMedicine.Id }, createdMedicine);
        }

        // PUT /api/medicines/5
        // 🔑 TYLKO Admin lub Kierownik mogą EDYTOWAĆ lek (np. zmienić cenę).
        // (Logika sprzedaży przez Farmaceutę będzie w OSOBNYM kontrolerze, np. SalesController)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Kierownik")]
        public async Task<IActionResult> Put(int id, [FromBody] Medicine medicine)
        {
            if (id != medicine.Id)
                return BadRequest("ID w URL i w ciele żądania się nie zgadzają");

            var existingMed = await _medicineService.GetMedicineByIdAsync(id);
            if (existingMed == null)
                return NotFound("Lek o tym ID nie istnieje");

            // Aktualizujemy wszystkie pola na podstawie danych z formularza
            existingMed.Name = medicine.Name;
            existingMed.Quantity = medicine.Quantity;
            existingMed.Price = medicine.Price;
            existingMed.ExpiryDate = medicine.ExpiryDate;

            await _medicineService.UpdateMedicineAsync(existingMed);
            return NoContent(); // Sukces
        }

        // DELETE /api/medicines/5
        // 🔑 TYLKO Admin lub Kierownik mogą USUNĄĆ lek z katalogu.
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Kierownik")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _medicineService.DeleteMedicineAsync(id);
            if (!result)
                return NotFound("Nie znaleziono leku do usunięcia");

            return NoContent(); // Sukces
        }
    }
}