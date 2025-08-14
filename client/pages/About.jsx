import React from "react";
import {
  Users,
  Heart,
  Trophy,
  MapPin,
  Clock,
  Star,
  Target,
  Eye,
  Award,
} from "lucide-react";
import { Card, Button } from "../components/ui";

const About = () => {
  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Former restaurant owner with 15+ years in the industry. Built DineDesk to solve problems he faced daily.",
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b169?w=400&h=400&fit=crop&crop=face",
      bio: "Tech veteran from Bangalore with expertise in scalable systems and restaurant technology.",
    },
    {
      name: "Arjun Patel",
      role: "Head of Product",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Previously at Zomato and Swiggy, passionate about creating intuitive restaurant experiences.",
    },
    {
      name: "Meera Singh",
      role: "Head of Customer Success",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Ensures every restaurant succeeds with DineDesk. Former operations manager at multiple restaurant chains.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Every decision we make prioritizes our restaurant partners' success and growth.",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "We strive for perfection in every feature, ensuring reliable and intuitive solutions.",
    },
    {
      icon: Users,
      title: "Together",
      description:
        "We believe in the power of collaboration between our team and restaurant communities.",
    },
    {
      icon: Trophy,
      title: "Innovation",
      description:
        "Constantly evolving our platform with cutting-edge technology and fresh ideas.",
    },
  ];

  const milestones = [
    {
      year: "2021",
      title: "Founded",
      description:
        "Started with a simple idea to modernize Indian restaurant operations",
    },
    {
      year: "2022",
      title: "First 100 Restaurants",
      description:
        "Reached our first milestone with restaurants across Mumbai and Delhi",
    },
    {
      year: "2023",
      title: "Pan-India Expansion",
      description:
        "Expanded to 15+ cities, serving 1000+ restaurants nationwide",
    },
    {
      year: "2024",
      title: "Market Leader",
      description:
        "Became the preferred POS solution for 5000+ restaurants across India",
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-[#ffe8db] to-[#fff4ef]">
      {/* Hero Section */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#3b1a0b] mb-6">
            About DineDesk
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            We're on a mission to transform how Indian restaurants operate,
            making them more efficient, profitable, and customer-focused through
            innovative technology.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#cc6600]">5000+</div>
              <div className="text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#cc6600]">15+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#cc6600]">1M+</div>
              <div className="text-gray-600">Orders Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#cc6600]">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="text-center transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-center mb-6">
                <Target className="h-16 w-16 text-[#cc6600]" />
              </div>
              <h3 className="text-2xl font-bold text-[#3b1a0b] mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To empower every Indian restaurant with cutting-edge technology
                that simplifies operations, reduces costs, and enhances customer
                experiences. We believe technology should work for restaurants,
                not against them.
              </p>
            </Card>

            <Card className="text-center transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-center mb-6">
                <Eye className="h-16 w-16 text-[#cc6600]" />
              </div>
              <h3 className="text-2xl font-bold text-[#3b1a0b] mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To become the most trusted and loved POS platform for Indian
                restaurants, helping them thrive in the digital age while
                preserving the warmth and authenticity that makes Indian dining
                special.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3b1a0b] text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="text-center transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <div className="flex items-center justify-center mb-4">
                    <IconComponent className="h-12 w-12 text-[#cc6600]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#3b1a0b] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3b1a0b] text-center mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our diverse team brings together restaurant expertise, technology
            innovation, and a shared passion for helping Indian restaurants
            succeed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#cc6600]/20"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#3b1a0b] mb-1">
                  {member.name}
                </h3>
                <p className="text-[#cc6600] font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Journey/Timeline */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3b1a0b] text-center mb-12">
            Our Journey
          </h2>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#cc6600] rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Card className="flex-1 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-2xl font-bold text-[#cc6600]">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-semibold text-[#3b1a0b]">
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-gray-700">{milestone.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 bg-[#3b1a0b] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Success Story?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Let's build the future of Indian restaurant technology together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#cc6600] hover:bg-[#b35500] text-white"
            >
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#3b1a0b]"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
