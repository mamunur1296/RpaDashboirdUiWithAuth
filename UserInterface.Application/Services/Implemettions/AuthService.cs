using Newtonsoft.Json;
using UserInterface.Application.Common;
using UserInterface.Application.DTOs;
using UserInterface.Application.Models;
using UserInterface.Application.Services.Interface;

namespace UserInterface.Application.Services.Implemettions
{
    public class AuthService : IAuthService
    {
        private readonly IHttpService _httpService;

        public AuthService(IHttpService httpService)
        {
            _httpService = httpService;
        }

        public async Task<List<ApplicationUser>> GetAllUser()
        {
            // Send the HTTP request asynchronously and await the response
            var responseBody = await _httpService.SendData(new ClientRequest
            {
                ContentType = ContentType.Json,
                ApiType = ApiType.Get,
                Url = Helper.BaseUrl + "api/User/GetAll"
            }, token: false);

            // Deserialize the response body to ResponseDto<string>
            var response = JsonConvert.DeserializeObject<List<ApplicationUser>>(responseBody);

            // Return the deserialized response
            return response;

        }

        public async Task<LoginResponseDto> Login(LoginDto model)
        {
            // Send the HTTP request asynchronously and await the response
            var responseBody = await _httpService.SendData(new ClientRequest
            {
                Data = model,
                ContentType = ContentType.Json,
                ApiType = ApiType.Post,
                Url = Helper.BaseUrl + "api/Auth/Login"
            }, token: false);

            // Deserialize the response body to ResponseDto<string>
            var response = JsonConvert.DeserializeObject<LoginResponseDto>(responseBody);

            // Return the deserialized response
            return response;
        }

        public async Task<ResponseDto> Register(UserRegisterationDto model)
        {
            // Send the HTTP request asynchronously and await the response
            var responseBody = await _httpService.SendData(new ClientRequest
            {
                Data = model,
                ContentType = ContentType.Json,
                ApiType = ApiType.Post,
                Url = Helper.BaseUrl + "api/User/Create"
            }, token: false);

            // Deserialize the response body to ResponseDto<string>
            var response = JsonConvert.DeserializeObject<ResponseDto>(responseBody);

            // Return the deserialized response
            return response;
        }
    }
}
