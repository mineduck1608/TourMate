using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class SystemRevenue
{
    public int SystemRevenueId { get; set; }

    public int PaymentId { get; set; }

    public float Value { get; set; }

    public virtual Payment Payment { get; set; } = null!;
}
