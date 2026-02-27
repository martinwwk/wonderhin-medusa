export interface LayoutOption {
  id: string
  name: string
}

export  const headerLayouts: LayoutOption[] = [
  {
    id: "Basic",
    name: "Basic"
  },
  {
    id: "Header3",
    name: "Header3"
  },
  {
    id: "Header4",
    name: "Header4"
  },

]

export const footerLayouts: LayoutOption[] = [
  {
    id: "Basic",
    name: "Basic"
  },
  {
    id: "Footer5",
    name: "Footer5"
  }
]
export const themes = [
  { name: "Main Demo", img: "/assets/demos/home-1.png",href:"/" },
  { name: "Chic Boutique", img: "/assets/demos/home-2.png",href:"/home2" },
  { name: "Modern Wardrobe", img: "/assets/demos/home-3.png",href:"/home3" },
  { name: "Underwear", img: "/assets/demos/home-4.png",href:"/home4" },
  { name: "Elegant Styles", img: "/assets/demos/home-5.png",href:"/home5" },
  { name: "Celeste Charm", img: "/assets/demos/home-6.png",href:"/home6" },
  { name: "Tiny Outfits", img: "/assets/demos/home-7.png",href:"/home7" },
]

