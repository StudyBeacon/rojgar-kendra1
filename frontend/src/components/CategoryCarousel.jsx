import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { Button } from "./ui/button"
import { setSearchQuery } from "@/redux/jobSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const categories = [
  "FrontEnd Developer",
  "BackEnd Developer",
  "Data Science",
  "Machine Learning",
  "Graphic Designer",
  "FullStack Developer",
]

const CategoryCarousel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleJobSearch = query => {
    dispatch(setSearchQuery(query))
    navigate("/browse")
  }

  return (
    <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto my-4 sm:my-8 md:my-12 lg:my-16">
      <CarouselContent className="-ml-2 md:-ml-4">
        {categories.map((category, index) => (
          <CarouselItem
            key={index}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1">
              <Button
                variant="ghost"
                className="w-full text-sm sm:text-base text-darkBlue hover:bg-aliceBlue hover:text-skyBlue transition-colors"
                onClick={() => handleJobSearch(category)}
              >
                {category}
              </Button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-center mt-4 gap-2 sm:gap-4">
        <CarouselPrevious className="relative  sm:absolute" />
        <CarouselNext className="relative sm:absolute" />
      </div>
    </Carousel>
  )
}

export default CategoryCarousel
