const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// ---------------------------------------------------------------
// Construit l'adresse du flux HLS d'un direct hébergé sur Kaltura
// (le système utilisé par RTI Play et NCI).
// ---------------------------------------------------------------
function kaltura({ partner, entry, flavors, uiConf, page, ks }) {
  const referrer = Buffer.from(page).toString("base64");
  const params = [];
  if (uiConf) params.push(`uiConfId=${uiConf}`);
  params.push(`referrer=${referrer}`);
  const ksPart = ks ? `/ks/${ks}` : "";
  return (
    `https://cdnapisec.kaltura.com/p/${partner}/sp/${partner}00/playManifest/entryId/${entry}` +
    `/protocol/https/format/applehttp/flavorIds/${flavors}${ksPart}/a.m3u8?${params.join("&")}`
  );
}

const noWeb = { notWebReady: true };

const CHANNELS = [
  {
    id: "civtv:rti1",
    name: "RTI 1",
    logo: "https://i.imgur.com/TybQZQS.png",
    description: "Première chaîne de la Radiodiffusion Télévision Ivoirienne",
    streams: [
      {
        title: "RTI 1 - Direct",
        url: kaltura({
          partner: 6234172,
          entry: "1_l7esl2lg",
          flavors: "1_7eanbbls,1_i3eaoq67,1_9ncksqqs,1_0fu4ccss,1_vbi79hef,1_ots3qoji,1_elidpux4",
          uiConf: 56536812,
          page: "https://rtiplay.ci/rti1/direct",
        }),
        behaviorHints: noWeb,
      },
    ],
  },
  {
    id: "civtv:rti2",
    name: "RTI 2",
    logo: "https://i.imgur.com/73ueXrp.png",
    description: "Deuxième chaîne de la RTI",
    streams: [
      {
        title: "RTI 2 - Direct",
        url: kaltura({
          partner: 6234172,
          entry: "1_i50dd97e",
          flavors: "1_i4o1hs85,1_39eoed0a,1_eqz22t2b,1_jfpufm1n,1_9u2r5es2,1_3lljh1ow,1_gws5bhrk",
          uiConf: 56536812,
          page: "https://rtiplay.ci/rti2/direct",
        }),
        behaviorHints: noWeb,
      },
    ],
  },
  {
    id: "civtv:rti3",
    name: "RTI 3 (La 3)",
    logo: "https://i.imgur.com/HdNshgF.png",
    description: "Troisième chaîne de la RTI (La 3)",
    streams: [
      {
        title: "RTI 3 - Direct",
        url: kaltura({
          partner: 6234172,
          entry: "1_vobpak2o",
          flavors: "1_m09asz4s,1_zaqil0qn,1_p2lbf8dy,1_wcjs92ac,1_kn94uzv2,1_fa7k6zy9,1_wtgnhve4",
          uiConf: 56536812,
          page: "https://rtiplay.ci/la3/direct",
        }),
        behaviorHints: noWeb,
      },
    ],
  },
  {
    id: "civtv:nci",
    name: "NCI",
    logo: "https://i.imgur.com/I3pv69r.png",
    description: "Nouvelle Chaîne Ivoirienne",
    streams: [
      {
        title: "NCI - Direct",
        url: kaltura({
          partner: 5571652,
          entry: "1_2gnrfyb6",
          flavors: "1_ei5378sr,1_3ahuyat1,1_hbf7spgv,1_16qga8l7,1_8jv5h53u,1_9wpnjnt6",
          page: "https://www.nci.ci/direct",
        }),
        behaviorHints: noWeb,
      },
      {
        // Variante avec le jeton de session vu sur le site : peut expirer.
        title: "NCI - Direct (secours, avec jeton)",
        url: kaltura({
          partner: 5571652,
          entry: "1_2gnrfyb6",
          flavors: "1_ei5378sr,1_3ahuyat1,1_hbf7spgv,1_16qga8l7,1_8jv5h53u,1_9wpnjnt6",
          page: "https://www.nci.ci/direct",
          ks: "djJ8NTU3MTY1MnxW4aIbSZaFU5dHUAj9Zc01RjFnOqspDidAfLbFnjuitF19AOqqQcp_IKuWBDpwwYExgFjfnPBgGTc2R3dXDI5le65NxZG4NfpewA_7Zt-4kVudohm4NKlGoGYlx93BF-A=",
        }),
        behaviorHints: noWeb,
      },
    ],
  },
  {
    id: "civtv:lifetv",
    name: "Life TV",
    logo: "https://i.imgur.com/iz9qHZk.png",
    description: "Life TV - Chaîne de télévision ivoirienne",
    streams: [
      {
        title: "Life TV - Direct",
        url: "https://strhls.streamakaci.tv/str_lifetv_lifetv/str_lifetv_multi/playlist.m3u8",
        behaviorHints: noWeb,
      },
    ],
  },
  {
    id: "civtv:7info",
    name: "7 Info",
    logo: "https://i.imgur.com/jcl1nNR.png",
    description: "7 Info - Chaîne d'information ivoirienne",
    streams: [
      {
        title: "7 Info - Direct",
        url: "https://video1.getstreamhosting.com:1936/8042/8042/playlist.m3u8",
        behaviorHints: noWeb,
      },
    ],
  },
];

const manifest = {
  id: "community.tv.ivoirienne",
  version: "1.0.2",
  name: "TV Ivoirienne",
  description: "Chaînes de télévision ivoiriennes gratuites en direct",
  resources: ["catalog", "meta", "stream"],
  types: ["tv"],
  idPrefixes: ["civtv:"],
  catalogs: [{ type: "tv", id: "civtv-live", name: "TV Ivoirienne" }],
};

const builder = new addonBuilder(manifest);

const toMeta = (c) => {
  const meta = { id: c.id, type: "tv", name: c.name, description: c.description };
  if (c.logo) {
    meta.poster = c.logo;
    meta.posterShape = "landscape";
    meta.logo = c.logo;
    meta.background = c.logo;
  }
  return meta;
};

builder.defineCatalogHandler(({ type, id }) =>
  Promise.resolve({
    metas: type === "tv" && id === "civtv-live" ? CHANNELS.map(toMeta) : [],
  })
);

builder.defineMetaHandler(({ id }) => {
  const c = CHANNELS.find((x) => x.id === id);
  return Promise.resolve({ meta: c ? toMeta(c) : null });
});

builder.defineStreamHandler(({ id }) => {
  const c = CHANNELS.find((x) => x.id === id);
  return Promise.resolve({ streams: c ? c.streams : [] });
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
