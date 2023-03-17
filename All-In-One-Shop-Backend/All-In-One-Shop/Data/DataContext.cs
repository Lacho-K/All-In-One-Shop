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
    }
}
