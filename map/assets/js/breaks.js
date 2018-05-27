const poiColors = ['#3cc0fd', '#36ace3', '#3099ca', '#247397', '#184c65', '#0c2632'];
const poiPoeBreaks = [5, 10, 20, 30, 50];
const poiChangeBreaks = [-8, -4,0, 4, 8];

const breaks = {
  poi: {
    title: "Podíl osob v insolvenci (%)",
    step: 1,
    decimals: 0,
    kraje: {
      breaks: [10, 30, 50, 100, 200],
      colors: poiColors
    },
    okresy: {
      breaks: [5, 10, 20, 40, 60, 100],
      colors: poiColors
    },
    orp: {
      breaks: [10, 30, 50, 100, 200],
      colors: poiColors
    },
    obce: {
      breaks: [2, 5, 8, 10, 14, 18],
      colors: poiColors
    }
  },
  poi_poe: {
    title: "Podíl insolvencí na exekuce (%)",
    step: 1,
    decimals: 0,
    kraje: {
      breaks: poiPoeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    },
    okresy: {
      breaks: poiPoeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    },
    orp: {
      breaks: poiPoeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    },
    obce: {
      breaks: poiPoeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    }
  },
  poi_change: {
    title: "Procentuální změna počtu osob v insolvenci 2016 – 2017",
    step: 0.1,
    decimals:1,
    kraje: {
      breaks: poiChangeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    },
    okresy: {
      breaks: poiChangeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    },
    orp: {
      breaks: poiChangeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    },
    obce: {
      breaks: poiChangeBreaks,
      colors: ['rgb(251, 205, 184)','rgb(229, 141, 139)','rgb(190, 85, 98)','rgb(138, 37, 60)','rgb(78, 0, 27)','rgb(30, 0, 10)']
    }
  },
}
