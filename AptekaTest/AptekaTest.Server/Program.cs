using Microsoft.EntityFrameworkCore;
using AptekaTest.Server;
using System.Diagnostics;
using AptekaTest.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace AptekaTest.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.Name = "AptekaTest.AuthCookie";
                    options.Cookie.HttpOnly = true;
                    options.Cookie.SameSite = SameSiteMode.Strict;
                    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

                    options.Events.OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = 401;
                        return Task.CompletedTask;
                    };

                    options.Events.OnRedirectToAccessDenied = context =>
                    {
                        context.Response.StatusCode = 403;
                        return Task.CompletedTask;
                    };
                });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("TylkoAdmin", policy => policy.RequireRole("Admin"));
                options.AddPolicy("AdminlubKierownik", policy => policy.RequireRole("Kierownik", "Admin"));
            });


            builder.Services.AddControllers();
            


            builder.Services.AddDbContext<MyDbContext>(options =>
                options.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=AptekaTestDb;Trusted_Connection=True;"));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
           

            // ✅ KONFIGURACJA CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy
                        .WithOrigins("https://localhost:61109", "http://localhost:61109")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            builder.Services.AddScoped<AlertService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<MedicineService>();
            builder.Services.AddScoped<OrderService>();
            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }


            app.UseCors("AllowReactApp");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
