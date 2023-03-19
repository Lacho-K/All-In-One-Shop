using System.ComponentModel.DataAnnotations;

namespace All_In_One_Shop.Models
{
    public class ShoppingCart
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public ICollection<ShoppingCartStorage> ShoppingCartStorages { get; set; }
    }
}
