using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using UserInterface.Application.DTOs;
using UserInterface.Application.Services.Interface;

namespace UserInterface.Application.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly IAuthService _authenticationService;
        private readonly ITokenService _tokenService;

        public AuthenticationController(IAuthService authenticationService, ITokenService tokenService)
        {
            _authenticationService = authenticationService;
            _tokenService = tokenService;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(UserRegisterationDto model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.Roles = new List<string> { "User" };
            var response = await _authenticationService.Register(model);

            if (!response.Success)
            {
                
                return View(model);
            }

            var data = response.Data;  // Assuming this might be needed later
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult Login(string? ReturnUrl = null)
        {
            ViewData["ReturnUrl"] = ReturnUrl;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> LoginUser(LoginDto model, string? ReturnUrl)
        {
            if (!ModelState.IsValid)
            {
                ViewData["ReturnUrl"] = ReturnUrl;
                return View("Login", model);
            }

            var loginResponse = await _authenticationService.Login(model);

            if (loginResponse.token == null)
            {
                ModelState.AddModelError("", "Invalid login attempt.");
                ViewData["ReturnUrl"] = ReturnUrl;
                return View("Login", model);
            }

            _tokenService.SaveToken(loginResponse.token);
            await UserLogin(loginResponse.token);

            if (!string.IsNullOrEmpty(ReturnUrl) && Url.IsLocalUrl(ReturnUrl))
            {
                return Redirect(ReturnUrl);
            }

            return RedirectToAction("Index", "Home");
        }
        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            _tokenService.ClearToken();
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCustomer()
        {
            var users = await _authenticationService.GetAllUser();
            return View(users);
        }

        private async Task UserLogin(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);

            foreach (var claim in jwt.Claims)
            {
                identity.AddClaim(claim);
            }

            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            // Optionally extract and log user details
            var userId = jwt.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            var userName = jwt.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var roles = jwt.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();
        }
    }
}
