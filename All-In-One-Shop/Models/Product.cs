using System.ComponentModel.DataAnnotations;

namespace All_In_One_Shop.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Description { get; set; }

        [StringLength(110)]

        public string ProductImageURL { get; set; } = string.Empty;

        public ProductTypes ProductType { get; set; }

        public decimal Price { get; set; }
    }
}
