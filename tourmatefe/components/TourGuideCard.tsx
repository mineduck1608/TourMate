// components/TourGuides.tsx
'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function TourGuideCard() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const guides = [
    {
      name: 'Vũ Lê Sơn',
      location: 'Đà Lạt',
      avatar: 'https://i.pravatar.cc/100?img=12',
      mainImage: 'https://img.freepik.com/free-photo/natural-green-hill-blue-countryside-asian_1417-1092.jpg',
      mainTitle: 'Trải nghiệm không quên về thiên nhiên và văn hóa',
      mainDescription: 'Khám phá vẻ đẹp hoang sơ và những câu chuyện thú vị.',
      experiences: [
        {
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
          title: 'Ký ức vui vẻ cùng khách hàng',
          description: 'Ngắm cảnh thiên nhiên và hồ bơi xanh mát.',
        },
        {
          image: 'https://img.freepik.com/free-photo/chinise-city_1417-1854.jpg',
          title: 'Hội An cổ kính',
          description: 'Cùng trải nghiệm sắc màu phố cổ và ẩm thực.',
        },
      ],
    },
    {
      name: 'Nguyễn Minh Khôi',
      location: 'Hội An',
      avatar: 'https://i.pravatar.cc/100?img=22',
      mainImage: 'https://images.unsplash.com/photo-1568454537842-d933259bb258',
      mainTitle: 'Khám phá Hội An cổ kính quyến rũ',
      mainDescription: 'Lắng nghe lịch sử và tận hưởng không khí phố cổ.',
      experiences: [
        {
          image: 'https://img.freepik.com/premium-photo/hoi-ancient-town-riverfront_78361-10241.jpg',
          title: 'Dẫn tour Hội An',
          description: 'Trải nghiệm các con phố và văn hóa địa phương.',
        },
        {
          image: 'https://img.freepik.com/free-photo/rice-noodles-bowl-curry-paste-with-chili-cucumber-long-bean-lime-garlic-spring-onion_1150-27029.jpg',
          title: 'Ẩm thực miền Trung',
          description: 'Thưởng thức món ăn truyền thống và hiện đại.',
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-100 py-10 px-6">
      <h2 className="text-center text-4xl font-serif italic mb-10" data-aos="fade-up">Hướng dẫn viên</h2>
      <div className="grid md:grid-cols-2 gap-10">
        {guides.map((guide, i) => (
          <div
            key={i}
            data-aos="fade-up"
            className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl"
          >
            <div className="p-5 flex items-center gap-4">
              <Image src={guide.avatar} alt={guide.name} width={50} height={50} className="rounded-full" />
              <div>
                <p className="italic font-medium text-lg">“{guide.name}”</p>
                <p className="text-sm text-gray-500">Hướng dẫn viên tại {guide.location}</p>
              </div>
            </div>

            <Image
              src={guide.mainImage}
              alt={guide.mainTitle}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />

            <div className="p-5">
              <h3 className="font-semibold text-xl text-gray-800 mb-2">{guide.mainTitle}</h3>
              <p className="text-sm text-gray-600">{guide.mainDescription}</p>
              <button className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium">XEM THÊM</button>
            </div>

            <div className="grid grid-cols-2 gap-3 px-5 pb-5">
              {guide.experiences.map((exp, j) => (
                <div key={j} className="relative rounded-xl overflow-hidden group">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    width={400}
                    height={200}
                    className="object-cover w-full h-32 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 bg-black/60 text-white text-xs p-2 w-full">
                    <p className="font-semibold text-sm">{exp.title}</p>
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
