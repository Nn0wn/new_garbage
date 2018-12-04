from matplotlib import pyplot
from matplotlib import mlab
from scipy import special
from scipy import optimize
from scipy import constants
import math
import numpy


R = 0.01
eps = 5.4
omg_param = 2 * constants.pi * 10 ** 9 * 67


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


rel_spd_rng = numpy.geomspace(1, 1000, 10000)
rel_spd_rng = [i - 1 for i in rel_spd_rng]
bs_rng = [bs_func(i, omg_param) for i in rel_spd_rng]


rel_spd_roots = check_omg_func()
axes = pyplot.figure().add_axes([0.08, 0.1, 0.87, 0.8])
axes.plot(rel_spd_rng, bs_rng)
axes.set_ylim(-1, 1)
axes.set_xlim(rel_spd_roots[0] - 0.02, rel_spd_roots[-1] + 0.1)
axes.set_xscale('log', basex=10)
axes.grid()
pyplot.show()


sup_range = mlab.frange(0.0, 5000.0, 0.1)
sup_results = [special.j0(i) for i in sup_range]
sup_intervals = get_intervals(sup_range, sup_results, 10)
sup_roots = [optimize.bisect(special.j0, i[0], i[1]) for i in sup_intervals]
omg_rng = mlab.frange(omg_param / 1000, omg_param * 2, omg_param / 10000)


for root in sup_roots:
    pyplot.plot(omg_rng, [phase_spd_func(omg, root) for omg in omg_rng])
    pyplot.plot(omg_rng[:-1], [group_spd_func([omg_rng[i], omg_rng[i + 1]], [phase_spd_func(omg_rng[i], root), phase_spd_func(omg_rng[i + 1], root)]) for i in range(len(omg_rng) - 1)])


pyplot.xlim(0, 8e11)
pyplot.ylim(0, 3e8)
pyplot.grid()
pyplot.show()