const TrustedBy = () => {
  const brandLogos = [
    { 
      src: "/lovable-uploads/7af8843a-fe77-4cde-832e-6fc4f9e6d735.png", 
      alt: "Papa John's",
      className: "h-6"
    },
    { 
      src: "/lovable-uploads/99a0bd6a-6a95-4b24-a2c6-729670a0fd9d.png", 
      alt: "Chipotle Mexican Grill",
      className: "h-12"
    },
    { 
      src: "/lovable-uploads/85fabfad-01e1-4fb2-ad84-af1721a70a3e.png", 
      alt: "Chick-fil-A",
      className: "h-12"
    },
    { 
      src: "/lovable-uploads/bf7d0574-4c30-484b-b795-559730728c71.png", 
      alt: "Applebee's",
      className: "h-14"
    }
  ];

  return (
    <div className="block md:hidden py-2 px-4">
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-1 font-medium">
          Trusted by Restaurateurs at
        </p>
        <div className="flex justify-around items-center gap-1 flex-wrap">
          {brandLogos.map((brand, index) => (
            <div key={index} className="flex items-center justify-around">
              <img 
                src={brand.src} 
                alt={brand.alt} 
                className={`${brand.className} max-w-full object-contain`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;