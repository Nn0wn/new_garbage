# coding: utf-8

import numpy as np
from matplotlib import pyplot as plt

# Кнстанты точек для линий

num_dots = 1000
num_dots_half = int(num_dots/2)
num_lines = 20
lines_half = int(num_lines/2)


# Константы варианта

x_left = 2
y_left = 6
x_mid = 7
y_mid = 1.5
x_mid_left = 6.6
y_mid_left = 1.8
x_mid_right = 7.4
y_mid_right = 1.8
x_right = 12
y_right = 6
x_plus = 5
y_plus_min = 3.5
y_plus_max = 8.5

minus_center = (7, 7.5)
minus_radius = 2

# Массив точек (х, у) из которых будут строится силовые линии
line_dots_left = np.array([np.linspace(x_left, x_mid_left, lines_half), np.linspace(y_left, y_mid_left, lines_half)])
line_dots_right = np.array([np.linspace(x_mid_right, x_right, lines_half), np.linspace(y_mid_right, y_right, lines_half)])
line_dots = np.append(line_dots_left, line_dots_right, axis=1).T

# Массив точек (х, у) отрицательного электрода
minus = np.array([(minus_center[0] + minus_radius * np.cos(i * 360 / num_dots * np.pi / 180),
                   minus_center[1] + minus_radius * np.sin(i * 360 / num_dots * np.pi / 180))
                  for i in range(num_dots)])

# Массив точек (х, у) положительного электрода
plus_left = np.array([np.linspace(x_left, x_mid, num_dots_half), np.linspace(y_left, y_mid, num_dots_half)])
plus_right = np.array([np.linspace(x_mid, x_right, num_dots_half), np.linspace(y_mid, y_right, num_dots_half)])
plus = np.append(plus_left, plus_right, axis=1).T

# Функция получения следующей точки для силовой линии


def get_next_point(x, y):

    x1, y1, x2, y2 = 0, 0, 0, 0

    for minus_point, plus_point in zip(minus, plus):

        r1 = ((x - plus_point[0]) ** 2 + (y - plus_point[1]) ** 2) ** 0.5

        if r1 != 0:
            x1 += (x - plus_point[0]) / r1 ** 2
            y1 += (y - plus_point[1]) / r1 ** 2

        r2 = ((x - minus_point[0]) ** 2 + (y - minus_point[1]) ** 2) ** 0.5

        if r2 != 0:
            x2 += (minus_point[0] - x) / r2 ** 2
            y2 += (minus_point[1] - y) / r2 ** 2

    x1 = x + (x1 + x2) * 1e-4
    y1 = y + (y1 + y2) * 1e-4

    return x1, y1


plt.figure(figsize=(9, 7))
plt.axes().set_aspect('equal')

for idx, line_dot in enumerate(line_dots):
    count = 500  # количество точек в силовой линии
    delta = 4e-2 if idx < 10 else -4e-2  # сдвиг силовой линии от положительного электрода к отрицательному

    x, y = line_dot[0] + delta, line_dot[1] + abs(delta)

    res_x = [x]
    res_y = [y]

    while True:
        count -= 1

        x, y = get_next_point(x, y)
        distance = (minus_center[0] - x) ** 2 + (minus_center[1] - y) ** 2
        if distance <= minus_radius ** 2 or count < 0:
            break

        res_x.append(x)
        res_y.append(y)

    plt.plot(res_x, res_y, lw=1, c='blue')

plt.plot(minus[:, 0], minus[:, 1], c='black', lw=2)
plt.plot(plus[:, 0], plus[:, 1], c='red', lw=2)
plt.xticks(range(int(min(minus[:, 0])) - 1, int(max(minus[:, 0])) + 1))
plt.grid()
plt.title('Силовые линии', fontsize=20)
plt.show()
