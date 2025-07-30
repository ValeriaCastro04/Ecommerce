'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className='w-full mb-12'
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`} className='block transition-transform duration-300 hover:scale-[1.02]'>
              <div className='relative mx-auto w-full banner-carousel-container overflow-hidden rounded-lg shadow-lg'>
                <Image
                  src={product.banner!}
                  alt={product.name}
                  fill
                  sizes='100vw'
                  className='object-cover w-full h-full'
                  priority={true}
                />
                <div className='absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent'>
                  <h2 className='bg-black/70 text-lg md:text-xl lg:text-2xl font-bold px-3 md:px-4 py-2 mb-4 text-white rounded-lg backdrop-blur-sm max-w-[90%] text-center'>
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;
