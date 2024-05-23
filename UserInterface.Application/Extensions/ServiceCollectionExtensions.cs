using Microsoft.AspNetCore.Authentication.Cookies;
using UserInterface.Application.Common;
using UserInterface.Application.Controllers;
using UserInterface.Application.Models;
using UserInterface.Application.Services.Implementations;
using UserInterface.Application.Services.Implemettions;
using UserInterface.Application.Services.Interface;

namespace UserInterface.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Reading the BaseUrl value from configuration
            var baseUrl = configuration["BaseUrl:AuthenticationAPI"];
            // Assign it to Helper.BaseUrl if Helper is a static class
            Helper.BaseUrl = baseUrl;

            services.AddHttpClient();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IHttpService, HttpService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IClientServices<ApplicationUser>, ClientServices<ApplicationUser>>();
            services.AddScoped<IClientServices<Chapter>,ClientServices<Chapter>>();
            services.AddScoped<IClientServices<Topic>,ClientServices<Topic>>();
            services.AddScoped<IClientServices<Questions>,ClientServices<Questions>>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.LoginPath = "/Authentication/Login";
                    options.ExpireTimeSpan = TimeSpan.FromDays(1);
                    options.ReturnUrlParameter = "ReturnUrl";
                });

            services.AddSession();

            return services;
        }
    }
}
