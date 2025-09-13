"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Shield, Zap, Database, MessageSquare, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8 text-white" />
          <span className="text-xl font-bold">Enterprise RAG</span>
        </div>
        <Button 
          onClick={handleGetStarted}
          variant="outline" 
          className="border-gray-600 text-white hover:bg-gray-900 hover:border-white transition-all duration-300"
        >
          Get Started
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Enterprise
                <span className="block bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                  Knowledge
                </span>
                <span className="block">RAG Chatbot</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                AI chatbot that integrates private company knowledge using 
                <span className="text-white font-semibold"> Retrieval Augmented Generation</span> for intelligent, contextual responses
              </p>
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-700"></div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-12 py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your enterprise knowledge into intelligent conversations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Database className="w-8 h-8" />,
                title: "Knowledge Integration",
                description: "Seamlessly integrate your private company documents, PDFs, and knowledge base"
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "RAG Technology",
                description: "Advanced Retrieval Augmented Generation for accurate, contextual responses"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Security",
                description: "Your data stays private and secure within your infrastructure"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Get instant answers from your knowledge base with sub-second response times"
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Natural Conversations",
                description: "Chat naturally with your AI assistant powered by advanced language models"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Source Citations",
                description: "Every response includes source references for transparency and verification"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-gray-400 group-hover:text-white transition-colors duration-300 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 lg:px-12 py-20 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple steps to get your enterprise knowledge chatbot running
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Documents",
                description: "Upload your PDFs, documents, and knowledge base files to create your private knowledge repository"
              },
              {
                step: "02",
                title: "AI Processing",
                description: "Our RAG system processes and indexes your content using advanced embedding models for optimal retrieval"
              },
              {
                step: "03",
                title: "Start Chatting",
                description: "Ask questions and get intelligent responses backed by your company's knowledge with source citations"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 border-2 border-gray-700 group-hover:border-white transition-all duration-300 mb-6">
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-white transition-colors duration-300">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
              Enterprise Knowledge?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start building your intelligent knowledge assistant today. No setup required.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-white text-black hover:bg-gray-200 text-lg px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400">Enterprise Knowledge RAG Chatbot</span>
          </div>
          <p className="text-gray-500 text-sm">
            Powered by RAG Technology
          </p>
        </div>
      </footer>
    </div>
  );
}