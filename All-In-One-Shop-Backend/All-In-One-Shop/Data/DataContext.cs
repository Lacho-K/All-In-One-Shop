using All_In_One_Shop.Models;
using Microsoft.EntityFrameworkCore;

namespace All_In_One_Shop.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }

        public DbSet<ProductType> ProductsTypes { get; set; }

        public DbSet<Storage> Storages { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<ShoppingCart> ShoppingCarts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ShoppingCartStorage>()
       .HasKey(sc => new { sc.ShoppingCartId, sc.StorageId });

            modelBuilder.Entity<ShoppingCartStorage>()
                .HasOne(sc => sc.ShoppingCart)
                .WithMany(s => s.ShoppingCartStorages)
                .HasForeignKey(sc => sc.ShoppingCartId);

            modelBuilder.Entity<ShoppingCartStorage>()
                .HasOne(sc => sc.Storage)
                .WithMany(s => s.ShoppingCartStorages)
                .HasForeignKey(sc => sc.StorageId);

            modelBuilder.Entity<User>()
                .HasOne(u => u.ShoppingCart)
                .WithOne(sc => sc.User)
                .HasForeignKey<ShoppingCart>(sc => sc.UserId);
        }
    }
}
