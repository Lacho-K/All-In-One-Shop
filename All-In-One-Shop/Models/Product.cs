using System.ComponentModel.DataAnnotations;

namespace All_In_One_Shop.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }
        
        [StringLength(200)]
        public string? Description { get; set; }

        [StringLength(100)]

        public string ProductImageURL { get; set; }

        public ProductTypes ProductType { get; set; }

        public decimal Price { get; set; }
    }
}
