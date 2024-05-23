using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using UserInterface.Application.Models.Base;

namespace UserInterface.Application.Models
{
    public class Chapter : BaseEntity
    {
        [Required]
        [DisplayName("Chapter Name")]
        public string title { get; set; }
    }
}
