using AptekaTest.Server.Models;
using Microsoft.Azure.Documents;
using Microsoft.EntityFrameworkCore;

namespace AptekaTest.Server
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<Sale> Sales { get; set; }
        public DbSet<Alert> Alerts { get; set; }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
           
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>().ToTable("Users"); // upewniamy się, że tabela się mapuje
            modelBuilder.Entity<Medicine>()
                .Property(m => m.Price)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Orders>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasColumnType("decimal(18, 2)");
            modelBuilder.Entity<Sale>()
                .Property(s => s.Total) 
                .HasColumnType("decimal(18, 2)");
        }
    }
}
