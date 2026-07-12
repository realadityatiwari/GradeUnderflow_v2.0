def calculate_percentage(obtained: float, maximum: float) -> float:
    """
    Safely calculates the percentage.
    Returns 0.0 if maximum is 0.
    """
    if maximum <= 0:
        return 0.0
    return (obtained / maximum) * 100.0

def calculate_contribution(percentage: float, max_contribution: float) -> float:
    """
    Calculates the mark contribution based on the percentage of the category.
    """
    return (percentage / 100.0) * max_contribution
