using System.ComponentModel.DataAnnotations;

namespace All_In_One_Shop.Models
{
    public class ProductType
    {
        [Key]
        public int Id { get; set; }

        [StringLength(60)]
        public string ProductTypeStr { get; set; } = string.Empty;
    }
}
