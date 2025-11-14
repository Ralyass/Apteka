using AptekaTest.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace AptekaTest.Server.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Orders Order { get; set; }
        public int MedicineId { get; set; }
        public Medicine Medicine { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}