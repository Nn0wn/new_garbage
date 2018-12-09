# coding: utf-8

import numpy as np
from matplotlib import pyplot as plt
from matplotlib import tri


def f1(x):
    return 2 + np.cos(x) ** 2


# точки для просчета углов
inner_fig_angles = np.linspace(0, 2 * np.pi, 50)
outer_fig_angles = np.linspace(0, 2 * np.pi, 50)

# считаем точки вершин треугольников фигур
inner_fig = np.array([(r * np.cos(alpha), r * np.sin(alpha)) for alpha, r in zip(inner_fig_angles,
                                                                                 f1(inner_fig_angles))])
outer_fig = np.array([(6 * np.cos(alpha), 6 * np.sin(alpha)) for alpha in outer_fig_angles])

# точки для построения высокоточных фигур
inner_fig_draw_angles = np.linspace(0, 2 * np.pi, 2000)
outer_fig_draw_angles = np.linspace(0, 2 * np.pi, 2000)

# рисуем фигуры
inner_fig_draw = np.array([(r * np.cos(alpha), r * np.sin(alpha)) for alpha, r in zip(inner_fig_draw_angles,
                                                                                      f1(inner_fig_draw_angles))])
outer_fig_draw = np.array([(6 * np.cos(alpha), 6 * np.sin(alpha)) for alpha in outer_fig_draw_angles])

# объединяем массивы фигур по x и y
X = np.hstack((inner_fig[:, 0], outer_fig[:, 0]))
Y = np.hstack((inner_fig[:, 1], outer_fig[:, 1]))

triangulation = tri.Triangulation(X, Y)

# объединяем координаты центров треугольников по x и y
x_mid = X[triangulation.triangles].mean(axis=1)
y_mid = Y[triangulation.triangles].mean(axis=1)

# первод в полярные координаты
R = (x_mid ** 2 + y_mid ** 2) ** 0.5
alpha = np.arctan(y_mid / x_mid)

# маска для скрытия треугольников внутри красной фигуры
mask = np.where(2 + np.cos(2 * alpha * np.pi / 180) ** 2 >= R, True, False)
triangulation.set_mask(mask)

plt.figure(figsize=(10, 10))
plt.axes().set_aspect('equal')

plt.plot(inner_fig_draw[:, 0], inner_fig_draw[:, 1], c='red', lw=1.5)
plt.plot(outer_fig_draw[:, 0], outer_fig_draw[:, 1], c='blue', lw=1.5)
plt.title('Трианугляция пространства', fontsize=20)
plt.triplot(triangulation, c='black', lw=0.5)
plt.show()
