using UserInterface.Application.DTOs;

namespace UserInterface.Application.Services.Interface
{
    public interface IHttpService
    {
        Task<string> SendData(ClientRequest requestData, bool token = true);
    }
}
