import harrierImg from "../assets/harriyellow.png";
import nexonImg from "../assets/nexonnew.png";
import safariImg from "../assets/safarinew.png";
import curveImg from "../assets/curvet.png";
import altrozImg from "../assets/altrozenew.png";
import tiagoImg from "../assets/tiagonew.png";
import punchImg from "../assets/punch.png";
import tigorImg from "../assets/TIGOR/opal-white-right-39-Picsart-BackgroundRemover.png";

import ashGrey from "../assets/harrier/ash-grey-left-8.png";
import coralRed from "../assets/harrier/coral-red-left-11.png";
import lunarWhite from "../assets/harrier/lunar-white-left-19.png";
import pebbleGrey from "../assets/harrier/pebble-grey-left-11.png";
import sunlitYellow from "../assets/harrier/sunlit-yellow-left-7.png";
import calgaryWhite from "../assets/nexon/calgary-white-right-43.png";
import daytonaGreyNexon from "../assets/nexon/daytona-grey-right-210.png";
import grasslandBeige from "../assets/nexon/grassland-beige-right-4.png";
import oceanBlue from "../assets/nexon/ocean-blue-right-1.png";
import pureGreyNexon from "../assets/nexon/pure-grey-right-31.png";
import galacticSapphire from "../assets/safari/galactic-sapphire-right-5.png";
import lunarSlate from "../assets/safari/lunar-slate-right-8.png";
import stardustAsh from "../assets/safari/stardust-ash-right-12.png";
import stellarFrost from "../assets/safari/stellar-frost-right-20.png";
import supernovaCopper from "../assets/safari/supernova-copper-right-5.png";
import daytonaGreyCurve from "../assets/CURVE/daytona-grey-left-162.png";
import goldEssence from "../assets/CURVE/gold-essence-left.png";
import nitroCrimson from "../assets/CURVE/nitro-crimson.png";
import pristineWhiteCurve from "../assets/CURVE/pristine-white-left-12.png";
import pureGreyCurve from "../assets/CURVE/pure-grey-left-11.png";
import arcadeGrey from "../assets/altroze/arcade-grey-left-52-Picsart-BackgroundRemover.png";
import duneGlow from "../assets/altroze/dune-glow-left-Picsart-BackgroundRemover.png";
import emberGlow from "../assets/altroze/ember-glow-left-Picsart-BackgroundRemover.png";
import prestineWhite from "../assets/altroze/prestine-white-left-1-Photoroom.png";
import royalBlue from "../assets/altroze/royal-blue-left-3-Photoroom.png";
import classyRed from "../assets/TIAGO/classy-red-right-Picsart-BackgroundRemover.png";
import daytonaGreyTiago from "../assets/TIAGO/daytona-grey-right-211-Picsart-BackgroundRemover.png";
import mysticSea from "../assets/TIAGO/mystic-seadt-dt-right-Picsart-BackgroundRemover.png";
import polarWhite from "../assets/TIAGO/polar-white-dt-right-1-Picsart-BackgroundRemover.png";
import tornadoBlue from "../assets/TIAGO/tornado-blue-right-30-Picsart-BackgroundRemover.png";
import calypsoRed from "../assets/punch/CalypsoRedLeft-Photoroom.png";
import daytonaGreyPunch from "../assets/punch/DaytonaGreyLeft-Photoroom.png";
import orcusWhite from "../assets/punch/OrcusWhiteLeft-Photoroom.png";
import tornadoBluePunch from "../assets/punch/TormadoBlueLeft-Photoroom.png";
import tropicalMist from "../assets/punch/TropicalMistLeft-Photoroom.png";
import arizonaBlue from "../assets/TIGOR/arizona-blue-right-25-Picsart-BackgroundRemover.png";
import classyRedTigor from "../assets/TIGOR/classy-red-right-2-Picsart-BackgroundRemover.png";
import daytonaGreyTigor from "../assets/TIGOR/daytona-grey-right-213-Picsart-BackgroundRemover.png";
import meteorBronze from "../assets/TIGOR/meteor-bronze-right-41-Picsart-BackgroundRemover.png";
import opalWhite from "../assets/TIGOR/opal-white-right-39-Picsart-BackgroundRemover.png";

export const CAR_IMAGE_BY_MODEL = {
    harrier: harrierImg,
    nexon: nexonImg,
    safari: safariImg,
    curve: curveImg,
    altroz: altrozImg,
    tiago: tiagoImg,
    punch: punchImg,
    tigor: tigorImg,
};

export const CAR_DISPLAY_NAMES = {
    harrier: "Harrier",
    nexon: "Nexon",
    safari: "Safari",
    curve: "Curvv",
    altroz: "Altroz",
    tiago: "Tiago",
    punch: "Punch",
    tigor: "Tigor",
};

export const VARIANT_OPTIONS = {
    harrier: ["XE", "XM", "XT", "XZ", "XZ+"],
    nexon: ["XE", "XM", "XT", "XZ", "XZ+"],
    safari: ["XE", "XM", "XT", "XZ", "XZ+"],
    curve: ["XE", "XM", "XT", "XZ", "XZ+"],
    altroz: ["XE", "XM", "XT", "XZ", "XZ+"],
    tiago: ["XE", "XM", "XT", "XZ", "XZ+"],
    punch: ["XE", "XM", "XT", "XZ", "XZ+"],
    tigor: ["XE", "XM", "XT", "XZ", "XZ+"],
};

export const CAR_COLORS = {
    harrier: {
        "Ash Grey": ashGrey,
        "Coral Red": coralRed,
        "Lunar White": lunarWhite,
        "Pebble Grey": pebbleGrey,
        "Sunlit Yellow": sunlitYellow,
    },
    nexon: {
        "Calgary White": calgaryWhite,
        "Daytona Grey": daytonaGreyNexon,
        "Grassland Beige": grasslandBeige,
        "Ocean Blue": oceanBlue,
        "Pure Grey": pureGreyNexon,
    },
    safari: {
        "Galactic Sapphire": galacticSapphire,
        "Lunar Slate": lunarSlate,
        "Stardust Ash": stardustAsh,
        "Stellar Frost": stellarFrost,
        "Supernova Copper": supernovaCopper,
    },
    curve: {
        "Daytona Grey": daytonaGreyCurve,
        "Gold Essence": goldEssence,
        "Nitro Crimson": nitroCrimson,
        "Pristine White": pristineWhiteCurve,
        "Pure Grey": pureGreyCurve,
    },
    altroz: {
        "Arcade Grey": arcadeGrey,
        "Dune Glow": duneGlow,
        "Ember Glow": emberGlow,
        "Pristine White": prestineWhite,
        "Royal Blue": royalBlue,
    },
    tiago: {
        "Classy Red": classyRed,
        "Daytona Grey": daytonaGreyTiago,
        "Mystic Sea": mysticSea,
        "Polar White": polarWhite,
        "Tornado Blue": tornadoBlue,
    },
    punch: {
        "Calypso Red": calypsoRed,
        "Daytona Grey": daytonaGreyPunch,
        "Orcus White": orcusWhite,
        "Tornado Blue": tornadoBluePunch,
        "Tropical Mist": tropicalMist,
    },
    tigor: {
        "Arizona Blue": arizonaBlue,
        "Classy Red": classyRedTigor,
        "Daytona Grey": daytonaGreyTigor,
        "Meteor Bronze": meteorBronze,
        "Opal White": opalWhite,
    },
};

export const VARIANT_PRICES = {
    harrier: {
        XE: 1225000,
        XM: 1400000,
        XT: 1600000,
        XZ: 1800000,
        "XZ+": 2000000,
    },
    nexon: { XE: 728000, XM: 900000, XT: 1200000, XZ: 1500000, "XZ+": 1740000 },
    safari: {
        XE: 1320000,
        XM: 1500000,
        XT: 1800000,
        XZ: 2100000,
        "XZ+": 2417000,
    },
    curve: {
        XE: 1366000,
        XM: 1450000,
        XT: 1550000,
        XZ: 1650000,
        "XZ+": 1771000,
    },
    altroz: {
        XE: 999000,
        XM: 1100000,
        XT: 1200000,
        XZ: 1300000,
        "XZ+": 1399000,
    },
    tiago: {
        XE: 1298000,
        XM: 1310000,
        XT: 1330000,
        XZ: 1350000,
        "XZ+": 1370000,
    },
    punch: { XE: 599000, XM: 700000, XT: 800000, XZ: 900000, "XZ+": 1000000 },
    tigor: { XE: 629000, XM: 730000, XT: 830000, XZ: 930000, "XZ+": 1030000 },
};

export const EV_VARIANT_PRICES = {
    harrier: {
        Adventure: 2149000,
        "Adventure Plus": 2198000,
        "Adventure S": 2199000,
        "Adventure S Plus": 2248000,
        "Fearless Plus": 2399000,
        "Fearless Plus Tech": 2462000,
        "Fearless Plus LR": 2524000,
        "Fearless Plus LR ACFC": 2586000,
        "Fearless Plus Top": 2649000,
        Empowered: 2749000,
        "Empowered Tech": 2815000,
        "Empowered LR": 2882000,
        "Empowered Top": 2948000,
        "Empowered Stealth Edition": 2824000,
        "Empowered Stealth Tech": 2890000,
        "Empowered Stealth LR": 2960000,
        "Empowered Stealth Top": 3023000,
    },
    nexon: {
        "Creative Plus": 1249000,
        Fearless: 1329000,
        "Fearless Plus": 1499000,
        Creative: 1399000,
        Empowered: 1599000,
        "Empowered Plus A": 1599000,
    },
    curve: {
        Creative: 1749000,
        Accomplished: 1849000,
        "Accomplished Long Range": 1925000,
        "Accomplished Plus (S)": 1929000,
        "Accomplished Plus (S) Long Range": 1999000,
        "Empowered Plus": 2125000,
        "Empowered Plus A": 2199000,
        "Empowered Plus A Top": 2224000,
    },
    tiago: {
        XE: 799000,
        XT: 899000,
        "XT Long Range": 1014000,
        "XZ Plus Tech": 1114000,
    },
    punch: {
        Smart: 809000,
        "Smart Plus": 1029000,
        "Smart Plus Long Range": 1089000,
        Adventure: 1159000,
        Empowered: 1229000,
        "Empowered Plus S": 1259000,
    },
    tigor: {
        XE: 1249000,
        XT: 1299000,
        "XZ Plus": 1349000,
        "XZ Plus LUX": 1375000,
    },
};

export const CAR_IMAGE_NAME_MAP = {
    harriyellow: "harrier",
    nexonnew: "nexon",
    safarinew: "safari",
    curvet: "curve",
    altrozenew: "altroz",
    tiagonew: "tiago",
    punch: "punch",
    "opal-white-right-39-Picsart-BackgroundRemover": "tigor",
    harrier: "harrier",
    nexon3: "nexon",
    safari2: "safari",
    curve: "curve",
    altroze: "altroz",
    tiago: "tiago",
    tiagoev: "tiago",
    artcurve: "curve",
    curveev: "curve",
    Harrierev2: "harrier",
    harrierev: "harrier",
    punchev: "punch",
    tigorev: "tigor",
    nexonev: "nexon",
};