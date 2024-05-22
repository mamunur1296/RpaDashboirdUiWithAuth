using UserInterface.Application.DTOs;
using UserInterface.Application.Models;

namespace UserInterface.Application.Services.Interface
{
    public interface IAuthService
    {
        Task<ResponseDto> Register(UserRegisterationDto model);
        Task<List<ApplicationUser>> GetAllUser();
        Task<LoginResponseDto> Login(LoginDto model);      
    }
}
