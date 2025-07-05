h1 = $("h1");

if (h1.css("visibility") == "visible") {
  $(".hide").text("Hide");
  h1.css("visibility", "hidden");
}
if (h1.css("visibility") == "hidden") {
  $(".hide").text("Show");
  h1.css("visibility", "visible");
}


h1.addClass("bigTitle")
$("img").attr("src","img.png");
$(".output").text($("img").attr("src"));
$(".button").on("click", function () {
    h1.slideToggle()
    
    h1.slideUp().slideDown().animate({opacity: 0.1}).animate({opacity: 1});
    // h1.animate({opacity: 0.5})
})

$(".hide").on("click", function () {
    if (h1.css("visibility") == "visible") {
        $(".hide").text("Hide");
        h1.css("visibility", "hidden");
    } else {
        $(".hide").text("Show");
        h1.css("visibility", "visible");
    }
});


h1.on("mouseenter", () => h1.css("color", "purple")
)
h1.on("mouseleave", () => h1.css("color", "red"));


