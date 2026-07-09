import re


def levenshtein_distance(s1, s2):
    """
    Classic dynamic-programming edit distance: minimum number of
    single-character insertions, deletions, or substitutions needed
    to turn s1 into s2.
    """

    m, n = len(s1), len(s2)

    if m == 0:
        return n

    if n == 0:
        return m

    previous_row = list(range(n + 1))
    current_row = [0] * (n + 1)

    for i in range(1, m + 1):

        current_row[0] = i

        for j in range(1, n + 1):

            cost = 0 if s1[i - 1] == s2[j - 1] else 1

            current_row[j] = min(
                previous_row[j] + 1,      # deletion
                current_row[j - 1] + 1,   # insertion
                previous_row[j - 1] + cost  # substitution
            )

        previous_row, current_row = current_row, previous_row

    return previous_row[n]


def simple_ratio(s1, s2):
    """
    Normalized similarity in the 0-100 range, based on Levenshtein
    distance -- equivalent in spirit to rapidfuzz's fuzz.ratio().
    """

    if not s1 and not s2:
        return 100.0

    total_len = len(s1) + len(s2)

    if total_len == 0:
        return 100.0

    distance = levenshtein_distance(s1, s2)

    return ((total_len - distance) / total_len) * 100


def _tokenize(s):

    return set(re.findall(r"[a-z0-9]+", s.lower()))


def token_set_ratio(s1, s2):
    """
    Order-independent, duplicate-independent, superset-tolerant
    similarity score in the 0-100 range -- a manual equivalent of
    rapidfuzz's fuzz.token_set_ratio().

    Approach (same idea rapidfuzz/fuzzywuzzy use internally):
    1. Tokenize both strings into lowercase word sets.
    2. Find the shared tokens (intersection) and each side's
       unique leftover tokens.
    3. Build three comparison strings: the intersection alone,
       intersection + s1's leftovers, intersection + s2's leftovers.
    4. Compare those three strings pairwise and take the best score.

    This means "Python" vs "Python programming" scores 100 (s1's
    tokens are fully contained in s2), and word order/duplicates
    don't affect the result, matching how a resume skill list is
    typically phrased differently from a job description.
    """

    tokens1 = _tokenize(s1)
    tokens2 = _tokenize(s2)

    if not tokens1 and not tokens2:
        return 100.0

    intersection = tokens1 & tokens2
    diff1 = tokens1 - tokens2
    diff2 = tokens2 - tokens1

    sorted_intersection = " ".join(sorted(intersection))
    sorted_diff1 = " ".join(sorted(diff1))
    sorted_diff2 = " ".join(sorted(diff2))

    base = sorted_intersection
    combined1 = (sorted_intersection + " " + sorted_diff1).strip()
    combined2 = (sorted_intersection + " " + sorted_diff2).strip()

    scores = [
        simple_ratio(base, combined1),
        simple_ratio(base, combined2),
        simple_ratio(combined1, combined2),
    ]

    return max(scores)