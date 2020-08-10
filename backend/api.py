import seaborn as sns
import colorsys
from flask import Flask
from flask import request

import ast

app = Flask(__name__)


@app.route("/backend/time")
def getTime():
    import time

    # No need to jsonify
    return {"time": time.time()}


@app.route("/backend/formAPI", methods=["GET", "POST"])
def formAPI():
    if request.method == "GET":
        print("request.args =", request.args)
        dim = request.args.get("dim")
        size = request.args.get("size")
        sV = request.args.get("sV")

        # Implement backend logic here

        # Implement SQL logic here

        # No need to jsonify
        return {"dim": dim, "size": size, "sV": sV}

    elif request.method == "POST":
        dict_str = request.data.decode("UTF-8")
        postData = ast.literal_eval(dict_str)

        inputParams = postData.get("params")

        dim = inputParams.get("dim")
        size = inputParams.get("size")
        sV = inputParams.get("sV")

        # Implement backend logic here

        # Implement SQL logic here

        # No need to jsonify
        return {"dim": dim, "size": size, "sV": sV}


###########################
## Generate Shift Vector ##
###########################
@app.route('/backend/getSV',  methods=['GET', 'POST'])
def getSV():
    if request.method == 'GET':
        dim = int(request.args.get('dim'))
        sC = float(request.args.get('sC'))
        sM = (request.args.get('sM'))

        sV = genShiftVector(sM, dim, sC)

        return {'sV': sV}

    elif request.method == 'POST':

        dict_str = request.data.decode("UTF-8")
        postData = ast.literal_eval(dict_str)

        inputParams = postData.get("params")

        dim = int(inputParams.get("dim"))
        sC = float(inputParams.get("sC"))
        sM = inputParams.get("sM")

        sV = genShiftVector(sM, dim, sC)

        return {'sV': sV}


#######################
## Generate Vertices ##
#######################
@app.route('/backend/getV',  methods=['GET', 'POST'])
def getV():
    if request.method == 'GET':
        dim = float(request.args.get('dim'))
        size = float(request.args.get('size'))
        sV = list(request.args.get('sV'))

        # Clean up invalid shift vector inputs
        # convert from string to list
        sV = sVStrToList(sV)

        # If too long remove until right length, if too short remove until right length
        # while len(sV) > dim:
        #     sV.pop()
        # while len(sV) < dim:
        #     sV.append(0)
        vertices = dict()
        for r in range(dim):
            for s in range(r+1, dim):
                for a in range(-size, size+1):
                    for b in range(-size, size+1):
                        vertices[f"{r} {s} {a} {b}"] = genVert(
                            dim, sV, r, a, s, b)
        return {'vertices': vertices}

    elif request.method == 'POST':
        dict_str = request.data.decode("UTF-8")

        postData = ast.literal_eval(dict_str)
        inputParams = postData.get("params")

        sC = float(inputParams.get("sC"))
        dim = int(inputParams.get("dim"))
        size = int(inputParams.get("size"))
        tileSize = int(inputParams.get('tileSize'))
        # tileSize = int(inputParams.get("tileSize"))
        sM = inputParams.get("sM")
        sV = genShiftVector(sM, dim, sC)

        # sV = list(inputParams.get("sV"))
        # sV = sVStrToList(sV)

        vertices = {}
        for r in range(dim-1):
            for s in range(r+1, dim):
                for a in range(-size, size+1):
                    for b in range(-size, size+1):
                        vertices[f"{r} {s} {a} {b}"] = genVert(
                            dim, sV, tileSize, r, a, s, b)
        return {'vertices': vertices}


@app.route('/backend/getTV',  methods=['GET', 'POST'])
def getTV():
    if request.method == 'GET':
        dim = float(request.args.get('dim'))
        sV = list(request.args.get('sV'))
        r = int(request.args.get('r'))
        s = int(request.args.get('s'))
        a = int(request.args.get('a'))
        b = int(request.args.get('b'))

        vert = genVert(dim, sV, r, a, s, b)
        return {'vert': vert}

    elif request.method == 'POST':

        dict_str = request.data.decode("UTF-8")
        postData = ast.literal_eval(dict_str)

        inputParams = postData.get("params")

        dim = int(inputParams.get("dim"))
        tileSize = int(inputParams.get('tileSize'))

        sV = [0]*dim

        r = int(inputParams.get('r'))
        s = int(inputParams.get('s'))
        a = int(inputParams.get('a'))
        b = int(inputParams.get('b'))

        vert = genVert(dim, sV, tileSize, r, a, s, b)
        return {'vert': vert}


def sVStrToList(sV):
    # First lets clean up the [] strings around the sV
    if '[' in sV:
        sV.remove('[')
    if ']' in sV:
        sV.remove(']')

    if type(sV) is list:
        # We currently have a list so lets join it together into a string and resplit w/ delimeter
        sV = ''.join(sV)
        sV = sV.split(',')
        sV = [cleanShiftStr(shift) for shift in sV]
        return sV
    return [69]*100


def cleanShiftStr(shiftStr):
    while shiftStr[0] == ' ':
        shiftStr = shiftStr[1:]
    while shiftStr[-1] == ' ':
        shiftStr = shiftStr[:-1]
    return float(shiftStr)


def genVert(dim, sV, tileSize, r, a, s, b):
    nV = [(-1)**((2/dim)*i) for i in range(dim)]
    if nV[s-r].imag == 0:
        kp = 1j*(nV[r]*(b-sV[s]) - nV[s]*(a-sV[r])) / 0.00001
    else:
        kp = 1j*(nV[r]*(b-sV[s]) - nV[s]*(a-sV[r])) / nV[s-r].imag

    k = [1+((kp/i).real+t)//1 for i, t in zip(nV, sV)]

    vertices = []
    for k[r], k[s] in [(a, b), (a+1, b), (a+1, b+1), (a, b+1)]:
        vSum = sum(x*t for t, x in zip(nV, k))
        vertices.append(vSum)
    return imagToReal(vertices, tileSize)


def imagToReal(vertices, tileSize):
    newVertices = []
    for vertex in vertices:
        scaledVert = tileSize*vertex
        newVertices.append((scaledVert.real, scaledVert.imag))
    return newVertices


def genShiftVector(sM, dim, sC):
    import math
    import random as rd
    bZ, bR, bH = False, False, False
    if sM == "sZ":
        bZ = True
    elif sM == "sR":
        bR = True
    elif sM == "sH":
        bH = True

    # All shifts set to zero
    if bZ:
        shiftVect = [0.0000001 for i in range(dim-1)]
        shiftVect.append(sC)
        return shiftVect
    # Take care of 3 dimmensional edge case
    if dim == 3:
        samplePopulation = list(range(1, 1000, 1))
        sample = rd.sample(samplePopulation, 2)
        samp1, samp2 = sample[0]/2, sample[1]/2
        final = sC - samp1 - samp2
        return [samp1, samp2, final]
    popMultiplier = 1
    samplePopulation = list(range(1, popMultiplier*dim))
    # Even dimmensions, something is going wrong here
    if dim % 2 == 0:
        lB = math.floor((dim/2)-1)
        samp = rd.sample(samplePopulation, lB)
        samp.sort()
        sV = []
        for i in range(lB):
            if bH:
                if bR:
                    sV.append(samp[i]/2)
                    sV.append(-samp[i]/2)
                else:
                    sV.append((i+1)/2)
                    sV.append(-(i+1)/2)
            else:
                if bR:
                    sV.append(samp[i]/(dim+5))
                    sV.append(-samp[i]/(dim+5))
                else:
                    sV.append((i+1)/dim)
                    sV.append(-(i+1)/dim)
        sV.append((1/3)*sC)
        sV.append((2/3)*sC)
        if bH:
            sV = [sv*0.2 for sv in sV]
        sV = [sv-0.000001 for sv in sV]
        return sV
    # Odd dimmensions
    else:
        lB = math.floor((dim-1)/2)
        uB = math.ceil((dim-1)/2)
        samp = rd.sample(samplePopulation, lB)
        samp.sort()
        sV = []
        for i in range(lB):
            if bH:
                if not bR:
                    sV.append((i+1)/2)
                    sV.append(-(i+1)/2)
                else:
                    sV.append(samp[i]/2)
                    sV.append(-samp[i]/2)
            else:
                if not bR:
                    sV.append((i+1)/dim)
                    sV.append(-(i+1)/dim)
                else:
                    sV.append(samp[i]/(dim+5))
                    sV.append(-samp[i]/(dim+5))
        if lB != uB:
            sV += [0.0]
        sV += [sC]
        return sV


#############################################
## Generate Adjacency Matrix Of Tile Types ##
#############################################
@app.route("/backend/getttm", methods=["GET", "POST"])
def getttm():
    if request.method == "GET":
        dim = int(request.args.get("dim"))

        ttm = genttm(dim)

        # Implement backend logic here

        # Implement SQL logic here

        # No need to jsonify
        return {"ttm": ttm}

    elif request.method == "POST":
        dict_str = request.data.decode("UTF-8")
        postData = ast.literal_eval(dict_str)

        inputParams = postData.get("params")

        dim = int(inputParams.get("dim"))

        ttm = genttm(dim)

        # Implement backend logic here

        # Implement SQL logic here

        # No need to jsonify
        return {"ttm": ttm}


def genttm(dim):
    # Intent: Find the tile type of all tiles
    if dim % 2 == 0:
        numTileTypes = int((dim/2)-1)
    else:
        numTileTypes = int((dim-1)/2)
    # create tile type adjacency matrix
    ttm = [[0 for x in range(dim)] for y in range(dim)]
    for x in range(dim):
        for y in range(1, numTileTypes+1):
            if x+y >= dim:
                ttm[x][(x+y)-dim] = y-1
            else:
                ttm[x][x+y] = y-1
            ttm[x][x-y] = y-1
    return ttm


#####################
## Generate Colors ##
#####################
@app.route("/backend/getColors", methods=["GET", "POST"])
def getColors():
    if request.method == "GET":
        manualCols = bool(request.args.get("manualCols"))
        manualCOls = True
        numCols = int(request.args.get("numCols"))

        colors = genColors(manualCols, numCols)

        # Implement backend logic here

        # Implement SQL logic here

        # No need to jsonify
        return {"colors": colors}

    elif request.method == "POST":
        dict_str = request.data.decode("UTF-8")
        postData = ast.literal_eval(dict_str)

        inputParams = postData.get("params")

        numCols = int(inputParams.get("numCols"))

        curCols = (inputParams.get("curCols"))

        colors = genSpecColors(numCols, curCols)

        # Implement backend logic here

        # Implement SQL logic here

        # No need to jsonify
        return {"colors": colors}


def genColors(manualCols, numCols):
    # if manualCols or numCols > 19:
    if manualCols:
        # Manually create colors
        # (hue, saturation, value)
        hsvCols = [(x/numCols, 1, 0.75) for x in range(numCols)]
        colors = list(map(lambda x: colorsys.hsv_to_rgb(*x), hsvCols))
        colors = [[255*color[0], 255*color[1], 255*color[2]]
                  for color in colors]
    else:
        # Classic colors
        # colors = sns.color_palette("bright", numCols)
        # colors = sns.color_palette("husl", numCols)
        # colors = sns.color_palette("cubehelix", numCols)

        # Divergent colors
        colors = sns.color_palette("BrBG", numCols)
        # colors = sns.color_palette("coolwarm", numCols)

        # Gradient colors
        # colors = sns.cubehelix_palette(numCols, dark=0.1, light=0.9)
    return colors


def genSpecColors(numCols, colType):
    # if manualCols or numCols > 19:
    if colType == "mc":
        hsvCols = [(x/numCols, 1, 0.75) for x in range(numCols)]
        colors = list(map(lambda x: colorsys.hsv_to_rgb(*x), hsvCols))
        colors = [[255*color[0], 255*color[1], 255*color[2]]
                  for color in colors]
        # CHP
    elif colType == "chp":
        colors = sns.cubehelix_palette(numCols)
    elif colType == "chp_rnd4":
        colors = sns.cubehelix_palette(numCols, rot=-.4)
    elif colType == "chp_s2d8_rd1":
        colors = sns.cubehelix_palette(numCols, start=2.8, rot=.1)
        # MPLP
    elif colType == "mplp_GnBu_d":
        colors = sns.mpl_palette("GnBu_d", numCols)
    elif colType == "mplp_seismic":
        colors = sns.mpl_palette("seismic", numCols)
        # CP_Misc
    elif colType == "cp":
        colors = sns.color_palette(n_colors=numCols)
    elif colType == "cp_Accent":
        colors = sns.color_palette("Accent", n_colors=numCols)
    elif colType == "cp_cubehelix":
        colors = sns.color_palette("cubehelix", n_colors=numCols)
    elif colType == "cp_flag":
        colors = sns.color_palette("flag", n_colors=numCols)
    elif colType == "cp_Paired":
        colors = sns.color_palette("Paired", n_colors=numCols)
    elif colType == "cp_Pastel1":
        colors = sns.color_palette("Pastel1", n_colors=numCols)
    elif colType == "cp_Pastel2":
        colors = sns.color_palette("Pastel2", n_colors=numCols)
    elif colType == "cp_tab10":
        colors = sns.color_palette("tab10", n_colors=numCols)
    elif colType == "cp_tab20":
        colors = sns.color_palette("tab20", n_colors=numCols)
    elif colType == "cp_tab20c":
        colors = sns.color_palette("tab20c", n_colors=numCols)
        # CP_Rainbow
    elif colType == "cp_gistncar":
        colors = sns.color_palette("gist_ncar", n_colors=numCols)
    elif colType == "cp_gistrainbow":
        colors = sns.color_palette("gist_rainbow", n_colors=numCols)
    elif colType == "cp_hsv":
        colors = sns.color_palette("hsv", n_colors=numCols)
    elif colType == "cp_nipyspectral":
        colors = sns.color_palette("nipy_spectral", n_colors=numCols)
    elif colType == "cp_rainbow":
        colors = sns.color_palette("rainbow", n_colors=numCols)
        # CP_Grad2
    elif colType == "cp_afmhot":
        colors = sns.color_palette("afmhot", n_colors=numCols)
    elif colType == "cp_autumn":
        colors = sns.color_palette("autumn", n_colors=numCols)
    elif colType == "cp_binary":
        colors = sns.color_palette("binary", n_colors=numCols)
    elif colType == "cp_bone":
        colors = sns.color_palette("bone", n_colors=numCols)
    elif colType == "cp_cividis":
        colors = sns.color_palette("cividis", n_colors=numCols)
    elif colType == "cp_cool":
        colors = sns.color_palette("cool", n_colors=numCols)
    elif colType == "cp_copper":
        colors = sns.color_palette("copper", n_colors=numCols)
    elif colType == "cp_hot":
        colors = sns.color_palette("hot", n_colors=numCols)
    elif colType == "cp_inferno":
        colors = sns.color_palette("inferno", n_colors=numCols)
    elif colType == "cp_magma":
        colors = sns.color_palette("magma", n_colors=numCols)
    elif colType == "cp_mako":
        colors = sns.color_palette("mako", n_colors=numCols)
    elif colType == "cp_plasma":
        colors = sns.color_palette("plasma", n_colors=numCols)
    elif colType == "cp_PuBuGn":
        colors = sns.color_palette("PuBuGn", n_colors=numCols)
    elif colType == "cp_Purples":
        colors = sns.color_palette("Purples", n_colors=numCols)
    elif colType == "cp_RdPu":
        colors = sns.color_palette("RdPu", n_colors=numCols)
    elif colType == "cp_rocket":
        colors = sns.color_palette("rocket", n_colors=numCols)
    elif colType == "cp_spring":
        colors = sns.color_palette("spring", n_colors=numCols)
    elif colType == "cp_summer":
        colors = sns.color_palette("summer", n_colors=numCols)
    elif colType == "cp_viridis":
        colors = sns.color_palette("viridis", n_colors=numCols)
    elif colType == "cp_winter":
        colors = sns.color_palette("winter", n_colors=numCols)
    elif colType == "cp_Wistia":
        colors = sns.color_palette("Wistia", n_colors=numCols)
    elif colType == "cp_YlOrRd":
        colors = sns.color_palette("YlOrRd", n_colors=numCols)
        # CP_Grad3
    elif colType == "cp_BrBG":
        colors = sns.color_palette("BrBG", n_colors=numCols)
    elif colType == "cp_brg":
        colors = sns.color_palette("brg", n_colors=numCols)
    elif colType == "cp_bwr":
        colors = sns.color_palette("bwr", n_colors=numCols)
    elif colType == "cp_CMRmap":
        colors = sns.color_palette("CMRmap", n_colors=numCols)
    elif colType == "cp_gistearth":
        colors = sns.color_palette("gist_earth", n_colors=numCols)
    elif colType == "cp_giststern":
        colors = sns.color_palette("gist_stern", n_colors=numCols)
    elif colType == "cp_gnuplot":
        colors = sns.color_palette("gnuplot", n_colors=numCols)
    elif colType == "cp_gnuplot2":
        colors = sns.color_palette("gnuplot2", n_colors=numCols)
    elif colType == "cp_icefire":
        colors = sns.color_palette("icefire", n_colors=numCols)
    elif colType == "cp_ocean":
        colors = sns.color_palette("ocean", n_colors=numCols)
    elif colType == "cp_PiYG":
        colors = sns.color_palette("PiYG", n_colors=numCols)
    elif colType == "cp_PRGn":
        colors = sns.color_palette("PRGn", n_colors=numCols)
    elif colType == "cp_prism":
        colors = sns.color_palette("prism", n_colors=numCols)
    elif colType == "cp_RdBu":
        colors = sns.color_palette("RdBu", n_colors=numCols)
    elif colType == "cp_RdGy":
        colors = sns.color_palette("RdGy", n_colors=numCols)
    elif colType == "cp_RdYlBu":
        colors = sns.color_palette("RdYlBu", n_colors=numCols)
    elif colType == "cp_RdYlGn":
        colors = sns.color_palette("RdYlGn", n_colors=numCols)
    elif colType == "cp_seismic":
        colors = sns.color_palette("seismic", n_colors=numCols)
    elif colType == "cp_Spectral":
        colors = sns.color_palette("Spectral", n_colors=numCols)
    elif colType == "cp_terrein":
        colors = sns.color_palette("terrein", n_colors=numCols)
    elif colType == "cp_vlag":
        colors = sns.color_palette("vlag", n_colors=numCols)
    else:
        hsvCols = [(x/numCols, 1, 0.75) for x in range(numCols)]
        colors = list(map(lambda x: colorsys.hsv_to_rgb(*x), hsvCols))
        colors = [[255*color[0], 255*color[1], 255*color[2]]
                  for color in colors]

    return colors


if __name__ == '__main__':
    app.run()
