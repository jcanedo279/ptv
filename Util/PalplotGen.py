import seaborn as sns
import colorsys
import matplotlib.pyplot as plt
sns.set()

numCols = 10
hsvCols = [(x/numCols, 1, 0.75) for x in range(numCols)]
colors = list(map(lambda x: colorsys.hsv_to_rgb(*x), hsvCols))
# colors = [[255*color[0], 255*color[1], 255*color[2]] for color in colors]
sns.palplot(colors)

plt.show()
