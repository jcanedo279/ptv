import React from "react";
import "./ColorPalettes.css";

import mc from "./palplot10/mc/mc.png";
// Cubehelix_palette
import chp_icon from "./palplot10/icons/chp_icon.png";
import chp from "./palplot10/chp/chp.png";
import chp_rnd4 from "./palplot10/chp/chp_rnd4.png";
import chp_s2d8_rd1 from "./palplot10/chp/chp_s2d8_rd1.png";
// MPL_palette
import mplp_icon from "./palplot10/icons/mplp_icon.png";
import mplp_GnBu_d from "./palplot10/mplp/mplp_GnBu_d.png";
import mplp_seismic from "./palplot10/mplp/mplp_seismic.png";
// color_palette
/// Misc
import cp_misc_icon from "./palplot10/icons/cp_misc_icon.png";
import cp from "./palplot10/cp/Misc/cp.png";
import cp_Accent from "./palplot10/cp/Misc/cp_Accent.png";
import cp_cubehelix from "./palplot10/cp/Misc/cp_cubehelix.png";
import cp_flag from "./palplot10/cp/Misc/cp_flag.png";
import cp_Paired from "./palplot10/cp/Misc/cp_Paired.png";
import cp_Pastel1 from "./palplot10/cp/Misc/cp_Pastel1.png";
import cp_Pastel2 from "./palplot10/cp/Misc/cp_Pastel2.png";
import cp_tab10 from "./palplot10/cp/Misc/cp_tab10.png";
import cp_tab20 from "./palplot10/cp/Misc/cp_tab20.png";
import cp_tab20c from "./palplot10/cp/Misc/cp_tab20c.png";
/// Rainbow
import cp_rainbow_icon from "./palplot10/icons/cp_rainbow_icon.png";
import cp_gistncar from "./palplot10/cp/Rainbow/cp_gistncar.png";
import cp_gistrainbow from "./palplot10/cp/Rainbow/cp_gistrainbow.png";
import cp_hsv from "./palplot10/cp/Rainbow/cp_hsv.png";
import cp_nipyspectral from "./palplot10/cp/Rainbow/cp_nipyspectral.png";
import cp_rainbow from "./palplot10/cp/Rainbow/cp_rainbow.png";
/// Grad2
import cp_Grad2_icon from "./palplot10/icons/cp_Grad2_icon.png";
import cp_afmhot from "./palplot10/cp/Grad2/cp_afmhot.png";
import cp_autumn from "./palplot10/cp/Grad2/cp_autumn.png";
import cp_binary from "./palplot10/cp/Grad2/cp_binary.png";
import cp_bone from "./palplot10/cp/Grad2/cp_bone.png";
import cp_cividis from "./palplot10/cp/Grad2/cp_cividis.png";
import cp_cool from "./palplot10/cp/Grad2/cp_cool.png";
import cp_copper from "./palplot10/cp/Grad2/cp_copper.png";
import cp_hot from "./palplot10/cp/Grad2/cp_hot.png";
import cp_inferno from "./palplot10/cp/Grad2/cp_inferno.png";
import cp_magma from "./palplot10/cp/Grad2/cp_magma.png";
import cp_mako from "./palplot10/cp/Grad2/cp_mako.png";
import cp_plasma from "./palplot10/cp/Grad2/cp_plasma.png";
import cp_PuBuGn from "./palplot10/cp/Grad2/cp_PuBuGn.png";
import cp_Purples from "./palplot10/cp/Grad2/cp_Purples.png";
import cp_RdPu from "./palplot10/cp/Grad2/cp_RdPu.png";
import cp_rocket from "./palplot10/cp/Grad2/cp_rocket.png";
import cp_spring from "./palplot10/cp/Grad2/cp_spring.png";
import cp_summer from "./palplot10/cp/Grad2/cp_summer.png";
import cp_viridis from "./palplot10/cp/Grad2/cp_viridis.png";
import cp_winter from "./palplot10/cp/Grad2/cp_winter.png";
import cp_Wistia from "./palplot10/cp/Grad2/cp_Wistia.png";
import cp_YlOrRd from "./palplot10/cp/Grad2/cp_YlOrRd.png";
/// Grad3
import cp_Grad3_icon from "./palplot10/icons/cp_Grad3_icon.png";
import cp_BrBG from "./palplot10/cp/Grad3/cp_BrBG.png";
import cp_brg from "./palplot10/cp/Grad3/cp_brg.png";
import cp_bwr from "./palplot10/cp/Grad3/cp_bwr.png";
import cp_CMRmap from "./palplot10/cp/Grad3/cp_CMRmap.png";
import cp_gistearth from "./palplot10/cp/Grad3/cp_gistearth.png";
import cp_giststern from "./palplot10/cp/Grad3/cp_giststern.png";
import cp_gnuplot from "./palplot10/cp/Grad3/cp_gnuplot.png";
import cp_gnuplot2 from "./palplot10/cp/Grad3/cp_gnuplot2.png";
import cp_icefire from "./palplot10/cp/Grad3/cp_icefire.png";
import cp_ocean from "./palplot10/cp/Grad3/cp_ocean.png";
import cp_PiYG from "./palplot10/cp/Grad3/cp_PiYG.png";
import cp_PRGn from "./palplot10/cp/Grad3/cp_PRGn.png";
import cp_prism from "./palplot10/cp/Grad3/cp_prism.png";
import cp_RdBu from "./palplot10/cp/Grad3/cp_RdBu.png";
import cp_RdGy from "./palplot10/cp/Grad3/cp_RdGy.png";
import cp_RdYlBu from "./palplot10/cp/Grad3/cp_RdYlBu.png";
import cp_RdYlGn from "./palplot10/cp/Grad3/cp_RdYlGn.png";
import cp_seismic from "./palplot10/cp/Grad3/cp_seismic.png";
import cp_Spectral from "./palplot10/cp/Grad3/cp_Spectral.png";
import cp_terrain from "./palplot10/cp/Grad3/cp_terrain.png";
import cp_vlag from "./palplot10/cp/Grad3/cp_vlag.png";

class ColorPalettes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPaletteStyle: { width: "100pt", height: "30pt" },
      curCol: "manualCols",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.pngNameToVal = this.pngNameToVal.bind(this);
  }

  handleInputChange(event) {
    console.log("eventTarget ,", event.target);
    console.log(`curCol value changed to`, event.target.name);
    this.setState({ curCol: event.target.name }, () => {
      this.props.saveStateUp(this.state);
    });
  }

  render() {
    const ch_palettes = [
      // CHP
      chp_icon,
      chp,
      chp_rnd4,
      chp_s2d8_rd1,
    ];
    const mpl_palettes = [
      // MPLP
      mplp_icon,
      mplp_GnBu_d,
      mplp_seismic,
    ];
    const cp_Misc = [
      // CP_MISC
      cp_misc_icon,
      cp,
      cp_Accent,
      cp_cubehelix,
      cp_flag,
      cp_Paired,
      cp_Pastel1,
      cp_Pastel2,
      cp_tab10,
      cp_tab20,
      cp_tab20c,
    ];
    const cp_Rainbow = [
      // CP_Rainbow
      cp_rainbow_icon,
      mc,
      cp_gistncar,
      cp_gistrainbow,
      cp_hsv,
      cp_nipyspectral,
      cp_rainbow,
    ];
    const cp_Grad2 = [
      // CP_Grad2
      cp_Grad2_icon,
      cp_afmhot,
      cp_autumn,
      cp_binary,
      cp_bone,
      cp_cividis,
      cp_cool,
      cp_copper,
      cp_hot,
      cp_inferno,
      cp_magma,
      cp_mako,
      cp_plasma,
      cp_PuBuGn,
      cp_Purples,
      cp_RdPu,
      cp_rocket,
      cp_spring,
      cp_summer,
      cp_viridis,
      cp_winter,
      cp_Wistia,
      cp_YlOrRd,
    ];
    const cp_Grad3 = [
      // CP_Grad3
      cp_Grad3_icon,
      cp_BrBG,
      cp_brg,
      cp_bwr,
      cp_CMRmap,
      cp_gistearth,
      cp_giststern,
      cp_gnuplot,
      cp_gnuplot2,
      cp_icefire,
      cp_ocean,
      cp_PiYG,
      cp_PRGn,
      cp_prism,
      cp_RdBu,
      cp_RdGy,
      cp_RdYlBu,
      cp_RdYlGn,
      cp_seismic,
      cp_Spectral,
      cp_terrain,
      cp_vlag,
    ];
    return (
      <div className="ColorPalettes">
        <br />
        <div className="grid-container w3-black">
          {ch_palettes.map((paletteName) => (
            <div className="grid-item w3-hover-sepia w3-margin-right">
              <img
                name={this.pngNameToVal(paletteName)}
                key={this.pngNameToVal(paletteName)}
                src={paletteName}
                style={this.state.colorPaletteStyle}
                onClick={this.handleInputChange}
              />
              <p className="hoverText" title="buzz hover text">
                {this.pngNameToVal(paletteName)}
              </p>
            </div>
          ))}
          {mpl_palettes.map((paletteName) => (
            <div className="grid-item w3-hover-sepia w3-margin-right">
              <img
                name={this.pngNameToVal(paletteName)}
                key={this.pngNameToVal(paletteName)}
                src={paletteName}
                style={this.state.colorPaletteStyle}
                onClick={this.handleInputChange}
              />
              <p className="hoverText" title="buzz hover text">
                {this.pngNameToVal(paletteName)}
              </p>
            </div>
          ))}
          {cp_Misc.map((paletteName) => (
            <div className="grid-item w3-hover-sepia w3-margin-right">
              <img
                name={this.pngNameToVal(paletteName)}
                key={this.pngNameToVal(paletteName)}
                src={paletteName}
                style={this.state.colorPaletteStyle}
                onClick={this.handleInputChange}
              />
              <p className="hoverText" title="buzz hover text">
                {this.pngNameToVal(paletteName)}
              </p>
            </div>
          ))}
          {cp_Rainbow.map((paletteName) => (
            <div className="grid-item w3-hover-sepia w3-margin-right">
              <img
                name={this.pngNameToVal(paletteName)}
                key={this.pngNameToVal(paletteName)}
                src={paletteName}
                style={this.state.colorPaletteStyle}
                onClick={this.handleInputChange}
              />
              <p className="hoverText" title="buzz hover text">
                {this.pngNameToVal(paletteName)}
              </p>
            </div>
          ))}
          {cp_Grad2.map((paletteName) => (
            <div className="grid-item w3-hover-sepia w3-margin-right">
              <img
                name={this.pngNameToVal(paletteName)}
                key={this.pngNameToVal(paletteName)}
                src={paletteName}
                style={this.state.colorPaletteStyle}
                onClick={this.handleInputChange}
              />
              <p className="hoverText" title="buzz hover text">
                {this.pngNameToVal(paletteName)}
              </p>
            </div>
          ))}
          {cp_Grad3.map((paletteName) => (
            <div className="grid-item w3-hover-sepia w3-margin-right">
              <img
                name={this.pngNameToVal(paletteName)}
                key={this.pngNameToVal(paletteName)}
                src={paletteName}
                style={this.state.colorPaletteStyle}
                onClick={this.handleInputChange}
              />
              <p className="hoverText" title="buzz hover text">
                {this.pngNameToVal(paletteName)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  pngNameToVal(name) {
    const colName = name.slice(name.lastIndexOf("/") + 1, name.indexOf("."));
    // If colname contains _ and the last part of colName is icon, then we return an empty string
    if (colName.includes("_") !== -1) {
      if (
        colName.slice(colName.lastIndexOf("_") + 1, colName.length) == "icon"
      ) {
        return " ";
      }
    }
    return colName;
  }
}

export default ColorPalettes;
