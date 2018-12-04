from matplotlib import pyplot
from matplotlib import mlab
from scipy import special
from scipy import optimize
from scipy import constants
import math
import numpy


R = 0.01
eps = 5.4
omg_param = 2 * math.pi * 10 ** 9 * 67
frq = 13 * 10 ** 9
del_t1 = 0.7692 * 10 ** -9
del_t2 = 1.538 * 10 ** -9
del_t3 = 0.07692 * 10 ** -9
P = 0.4
N = 2 ** 10
N1 = 60


def get_intervals(rel_spd_rng_loc, bs_rng_loc, limit=0):
    prev = bs_rng_loc[0]
    intervals = []
    for i in range(1, len(bs_rng_loc)):
        if bs_rng_loc[i] * prev < 0:
            intervals.append([rel_spd_rng_loc[i - 1], rel_spd_rng_loc[i]])
        if 0 < limit <= len(intervals):
            break
        prev = bs_rng_loc[i]
    return intervals


def phase_spd_func(omg_loc, bs_root_loc):
    temp = omg_loc ** 2 * eps / constants.speed_of_light ** 2 - bs_root_loc ** 2 / R ** 2
    if temp <= 0:
        return math.inf
    else:
        return omg_loc / math.sqrt(temp)


def group_spd_func(omg_loc, phase_spd_loc):
    if phase_spd_loc[0] * phase_spd_loc[1] != 0:
        temp = omg_loc[1] / phase_spd_loc[1] - omg_loc[0] / phase_spd_loc[0]
        if temp != 0:
            return (omg_loc[1] - omg_loc[0]) / temp
        else:
            return math.inf


def kp_func(rel_spd_loc, omg_loc):
    temp = eps - 1 / rel_spd_loc ** 2
    if temp <= 0:
        return math.inf
    else:
        return omg_loc / constants.speed_of_light * math.sqrt(temp)


def bs_func(rel_spd_loc, omg_loc=omg_param):
    return special.j0(kp_func(rel_spd_loc, omg_loc) * R)


def check_omg_func():
    i_rng = range(0, 1000)
    rel_spd_loc = [1 / math.sqrt(eps) + 4 / 1000 * i for i in i_rng]
    bessel_rng = [bs_func(i, omg_param) for i in rel_spd_loc]
    root_intervals = get_intervals(rel_spd_loc, bessel_rng)
    rel_spd_roots_loc = [optimize.bisect(bs_func, i[0], i[1]) for i in root_intervals]
    return rel_spd_roots_loc


def heaviside_func(x_loc):
    if x_loc >= 0:
        return 1
    else:
        return 0


def f2(t_loc):
    return math.sin(frq * 2 * math.pi * t_loc)*(heaviside_func(t_loc - del_t1) - heaviside_func(t_loc))


def mod_sin(x_loc):
    if x_loc == 0:
        return 1
    else:
        return math.sin(x_loc)/x_loc


def spectrum_fun(f_loc):
    return mod_sin((f_loc - frq) * 2 * math.pi * del_t1 / 2) * del_t1 * 9 ** 10


def signal(t_loc, z_loc, frqss_loc, spectre):
    sgn = 0
    for i in range(len(frqss_loc)):
        omg = frqss_loc[i] * 2 * math.pi
        phs_spd_loc = phase_spd_func(omg, sup_roots[0])
        sgn += spectre[i] * math.cos(omg * t_loc - z_loc * omg / phs_spd_loc)
    return sgn


def max_dist(distance_loc, fk_rng_loc, spec_rng_loc):
    max_amplitude = 0
    while max_amplitude < P * max_deviation:
        for j in range(distance_loc, distance_loc + 16):
            amplitude_current = math.fabs(signal(del_t1 / 2, j / 100, fk_rng_loc, spec_rng_loc))
            if amplitude_current > max_amplitude:
                max_amplitude = amplitude_current
        distance_loc += 17.5
    print("Max distance is", distance_loc/100, "m")


sup_range = mlab.frange(0.0, 5000.0, 0.1)
sup_results = [special.j0(i) for i in sup_range]
sup_intervals = get_intervals(sup_range, sup_results, 1)
sup_roots = [optimize.bisect(special.j0, i[0], i[1]) for i in sup_intervals]
omg_rng = mlab.frange(omg_param / 1000, omg_param * 2, omg_param / 10000)
spd_rng = [phase_spd_func(omg, sup_roots[0]) for omg in omg_rng]


pyplot.plot(omg_rng, spd_rng, color="black")
pyplot.xlim(0.2 * 10 ** 11, 2 * 10 ** 11)
pyplot.ylim(1 * 10 ** 8, 6 * 10 ** 8)
pyplot.grid()
pyplot.show()


time_moments = [del_t2 * i/(N-1) for i in range(N)]
imp_rng = [f2(t) for t in time_moments]
pyplot.plot(time_moments, imp_rng, color="black")
pyplot.grid()
pyplot.show()


fk_rng = [i/del_t2 for i in range(N1)]
spec_rng_abs = [numpy.abs(spectrum_fun(i)) for i in fk_rng]
specter_range_norm = spec_rng_abs / numpy.max(spec_rng_abs)
pyplot.plot(fk_rng, specter_range_norm, marker='x', color="black")
pyplot.show()


distances = [i / 10 for i in range(1200)]
sig = [signal(del_t1 / 2, i / 100, fk_rng, spec_rng_abs) for i in distances]
max_deviation = numpy.max(sig[:10])

pyplot.plot(distances, sig, color="black")
pyplot.grid()
pyplot.show()

max_dist(10, fk_rng, spec_rng_abs)
