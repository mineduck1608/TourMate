using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Cvapplication
{
    public int CvApplicationId { get; set; }

    public string FullName { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string Gender { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Link { get; set; }

    public string Image { get; set; } = null!;

    public string? Description { get; set; }

    public string Status { get; set; } = null!;

    public string? Response { get; set; }
}
