import kitchenImage from "@/assets/kitchen-cleaning.jpg";
import bathImage from "@/assets/bath-care.jpg";
import utilityImage from "@/assets/home-utility.jpg";

export type Product = { id:string; name:string; category:string; price:number; mrp:number; rating:number; reviews:number; pack:string; image:string; imageUrl?:string; badge?:string; description:string; stock:string; bulk:[number,number][] };
export const categories = [
  {slug:"kitchen-cleaning",name:"Kitchen Cleaning",image:kitchenImage,count:18,blurb:"Scrubbers, pads & brushes"},
  {slug:"bath-care",name:"Bath Care",image:bathImage,count:12,blurb:"Loofahs & body brushes"},
  {slug:"home-utility",name:"Home Utility",image:utilityImage,count:16,blurb:"Everyday home helpers"},
  {slug:"camphor",name:"Camphor & More",image:utilityImage,count:8,blurb:"Pure daily essentials"},
];
export const products: Product[] = [
  {id:"power-scrub-sponges",name:"Power Scrub Sponge — Pack of 4",category:"kitchen-cleaning",price:79,mrp:110,rating:4.7,reviews:624,pack:"4 pieces",image:kitchenImage,badge:"Bestseller",description:"Dual-layer sponge with a tough green scouring surface and soft absorbent foam for everyday dishes.",stock:"In stock",bulk:[[12,69],[48,59]]},
  {id:"steel-scrubber",name:"Stainless Steel Scrubber",category:"kitchen-cleaning",price:45,mrp:60,rating:4.6,reviews:418,pack:"Pack of 3",image:kitchenImage,badge:"28% off",description:"Rust-resistant spiral scrubbers for stubborn stains on steel cookware and kadais.",stock:"In stock",bulk:[[12,39],[60,34]]},
  {id:"scouring-pads",name:"Heavy Duty Scouring Pads",category:"kitchen-cleaning",price:55,mrp:80,rating:4.5,reviews:281,pack:"Pack of 5",image:kitchenImage,description:"Long-lasting fibre pads that cut grease while retaining shape through repeated use.",stock:"In stock",bulk:[[10,49],[50,41]]},
  {id:"dish-brush",name:"Easy Grip Dish Brush",category:"kitchen-cleaning",price:99,mrp:139,rating:4.4,reviews:156,pack:"1 piece",image:kitchenImage,badge:"New",description:"Comfortable grip and firm rounded bristles for vessels, sinks and tile corners.",stock:"Only 7 left",bulk:[[12,89],[36,79]]},
  {id:"mesh-loofah",name:"CloudSoft Mesh Loofah",category:"bath-care",price:69,mrp:99,rating:4.8,reviews:902,pack:"Pack of 2",image:bathImage,badge:"Popular",description:"Soft, full mesh loofahs with hanging loops for a rich lather and gentle daily exfoliation.",stock:"In stock",bulk:[[12,59],[48,49]]},
  {id:"rope-bath-brush",name:"Nylon Rope Bath Scrubber",category:"bath-care",price:119,mrp:165,rating:4.6,reviews:337,pack:"1 piece",image:bathImage,description:"Long braided scrubber that reaches the back comfortably and dries quickly after use.",stock:"In stock",bulk:[[12,105],[36,94]]},
  {id:"long-bath-brush",name:"Long Handle Bath Brush",category:"bath-care",price:179,mrp:240,rating:4.3,reviews:194,pack:"1 piece",image:bathImage,description:"Curved handle and skin-friendly bristles for easy daily bathing and dry brushing.",stock:"In stock",bulk:[[8,159],[24,139]]},
  {id:"microfibre-cloths",name:"Everyday Microfibre Cloths",category:"home-utility",price:149,mrp:199,rating:4.7,reviews:513,pack:"Pack of 4",image:utilityImage,badge:"Value pack",description:"Colour-coded, lint-free cleaning cloths for kitchen counters, glass and furniture.",stock:"In stock",bulk:[[10,129],[40,109]]},
  {id:"utility-brush",name:"Firm Grip Utility Brush",category:"home-utility",price:89,mrp:125,rating:4.4,reviews:209,pack:"1 piece",image:utilityImage,description:"Dense angled bristles for floors, bathrooms, balconies and hard-to-reach edges.",stock:"In stock",bulk:[[12,79],[48,69]]},
  {id:"pure-camphor",name:"Pure Camphor Tablets",category:"camphor",price:129,mrp:160,rating:4.8,reviews:1204,pack:"100 g jar",image:utilityImage,badge:"Top rated",description:"Clean-burning premium camphor tablets in a secure reusable jar for everyday puja.",stock:"In stock",bulk:[[12,115],[48,99]]},
];
export const formatPrice=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
export const getProduct=(id:string)=>products.find(p=>p.id===id);
export const getCategory=(slug:string)=>categories.find(c=>c.slug===slug);
