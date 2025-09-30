"use client";
import heartSrc from "public/assets/heart.svg";
import testimonialSpiegelSrc from "public/assets/testimonial-spiegel.jpg";
import testimonialSantiSrc from "public/assets/testimonial-santi.jpg";
import testimonialVivianSrc from "public/assets/testimonial-vivian.jpg";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";

const TESTIMONIALS = [
  {
    src: testimonialSpiegelSrc,
    quote:
      "Apply Wizz completely transformed my job search. Their daily application service landed me interviews at 5 top tech companies within just 2 weeks. The ATS-optimized resume was a game changer!",
    name: "Priya Sharma",
    title: "Software Engineer",
    rating: 5,
    company: "Meta"
  },
  {
    src: testimonialSantiSrc,
    quote:
      "As an international student, I was struggling with job applications. Apply Wizz not only applied to 20+ jobs daily for me but also helped me understand the U.S. job market better. Got my dream job!",
    name: "Rahul Patel",
    title: "Data Scientist",
    rating: 5,
    company: "Google"
  },
  {
    src: testimonialVivianSrc,
    quote:
      "The team at Apply Wizz is incredible! They handled all my applications while I focused on interview prep. Within 3 weeks, I had multiple offers. Best investment in my career!",
    name: "Ananya Singh",
    title: "Product Manager",
    rating: 5,
    company: "Microsoft"
  },
];

const LG_TESTIMONIALS_CLASSNAMES = [
  "z-10",
  "translate-x-44 translate-y-24 opacity-40",
  "translate-x-32 -translate-y-28 opacity-40",
];
const SM_TESTIMONIALS_CLASSNAMES = ["z-10", "opacity-0", "opacity-0"];
const ROTATION_INTERVAL_MS = 8 * 1000; // 8s

export const Testimonials = ({ children }: { children?: React.ReactNode }) => {
  const [testimonialsClassNames, setTestimonialsClassNames] = useState(
    LG_TESTIMONIALS_CLASSNAMES
  );
  const isHoveredOnTestimonial = useRef(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isHoveredOnTestimonial.current) {
        setTestimonialsClassNames((preClassNames) => {
          return [preClassNames[1], preClassNames[2], preClassNames[0]];
        });
      }
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const { isLg } = useTailwindBreakpoints();
  useEffect(() => {
    setTestimonialsClassNames(
      isLg ? LG_TESTIMONIALS_CLASSNAMES : SM_TESTIMONIALS_CLASSNAMES
    );
  }, [isLg]);

  return (
    <section className="mx-auto -mt-2 px-8 pb-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center mb-16">
        <h2 
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: "'Noto Sans', sans-serif", color: '#1E1E1E' }}
        >
          People{" "}
          <Image src={heartSrc} alt="love" className="-mt-1 inline-block w-8" />{" "}
          <span 
            className="italic bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Apply Wizz
          </span>
        </h2>
        <p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          style={{ fontFamily: "'Noto Sans', sans-serif" }}
        >
          Hear from 500+ professionals who accelerated their career success with Apply Wizz
        </p>
      </div>
      
      <div className="mx-auto mt-10 h-[300px] max-w-lg lg:h-[450px] lg:pt-16">
        <div className="relative lg:ml-[-50px]">
          {TESTIMONIALS.map(({ src, quote, name, title, rating, company }, idx) => {
            const className = testimonialsClassNames[idx];
            return (
              <div
                key={idx}
                className={`absolute max-w-lg rounded-[2rem] bg-white shadow-xl border border-gray-100 transition-all duration-1000 ease-linear hover:shadow-2xl ${className}`}
                onMouseEnter={() => {
                  if (className === "z-10") {
                    isHoveredOnTestimonial.current = true;
                  }
                }}
                onMouseLeave={() => {
                  if (className === "z-10") {
                    isHoveredOnTestimonial.current = false;
                  }
                }}
              >
                <figure className="p-8 text-gray-900 lg:p-10">
                  <div className="flex items-start gap-6">
                    <Image
                      className="h-16 w-16 select-none rounded-full ring-4 ring-blue-100 lg:h-20 lg:w-20"
                      src={src}
                      alt="profile"
                    />
                    <div className="flex-1">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">★</span>
                        ))}
                        <span className="text-sm text-gray-500 ml-2">({rating}.0)</span>
                      </div>
                                    
                      <blockquote>
                        <p 
                          className="text-gray-700 text-base leading-relaxed mb-4 italic"
                          style={{ fontFamily: "'Noto Sans', sans-serif" }}
                        >
                          "{quote}"
                        </p>
                      </blockquote>
                                    
                      <figcaption>
                        <div className="flex flex-col">
                          <div 
                            className="font-bold text-gray-900 text-lg"
                            style={{ fontFamily: "'Noto Sans', sans-serif" }}
                          >
                            {name}
                          </div>
                          <div 
                            className="text-blue-600 font-medium text-sm"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {title}
                          </div>
                          <div 
                            className="text-gray-500 text-sm"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {company}
                          </div>
                        </div>
                      </figcaption>
                    </div>
                  </div>
                </figure>
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </section>
  );
};
