using System.ComponentModel.DataAnnotations;

namespace All_In_One_Shop.Models
{
    public class ShoppingCart
    {
        [Key]
        public int Id { get; set; }

        public Product[]? products { get; set; }
    }
}
