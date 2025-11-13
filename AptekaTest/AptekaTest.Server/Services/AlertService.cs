using AptekaTest.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AptekaTest.Server.Services
{
    public class AlertService
    {
        private readonly MyDbContext _context;
        public AlertService(MyDbContext context)
        {
            _context = context;
        }
        public async Task<List<Alert>> GetAlertsAsync()
        {
            var alerts = new List<Alert>();

            var lowStock = await _context.Medicines
                .Where(d => d.Quantity < 10).ToListAsync();
            foreach (var drug in lowStock)
                alerts.Add(new Alert 
                { 
                    Type = "lowstock", Message = $"Niski stan leku {drug.Name}: {drug.Quantity} szt." 
                });


            var expiring = await _context.Medicines
                .Where(m => m.ExpiryDate < DateTime.Now.AddDays(30)).ToListAsync();
            foreach (var med in expiring)
                alerts.Add(new Alert
                {
                    Type = "expiry",
                    Message = $"Lek {med.Name} wkrótce straci ważność ({med.ExpiryDate.ToShortDateString()})."
                });
            return alerts;
        }
    }
}
