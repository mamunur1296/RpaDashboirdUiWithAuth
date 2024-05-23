using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using UserInterface.Application.Models.Base;

namespace UserInterface.Application.Models
{
    public class Questions : BaseEntity
    {
        [Required]
        [DisplayName("Questions")]
        public string title { get; set; }
        [Required]
        [DisplayName("Answer")]
        public string answers { get; set; }
        [Required]
        [DisplayName("Topic Name")]
        public Guid TopicId { get; set; }
        [Required]
        [DisplayName("Chapter Name")]
        public Guid ChapterId { get; set; }
    }
}
