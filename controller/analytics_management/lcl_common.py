# type: ignore


def get_pct_diff(prev_val, curr_val):
    pct_diff = ((curr_val - prev_val) * 100) / prev_val
    pct_diff = round(pct_diff, 1)
    return str(pct_diff)