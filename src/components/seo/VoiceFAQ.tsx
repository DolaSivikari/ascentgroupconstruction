import { Mic, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { VOICE_OPTIMIZED_FAQS } from "@/utils/seo/ai-content";

interface VoiceFAQProps {
  category?: string;
  limit?: number;
  className?: string;
  showVoiceQueries?: boolean;
}

/**
 * Voice-optimized FAQ component for AEO (Answer Engine Optimization)
 * Displays FAQs optimized for voice search and AI assistants
 */
const VoiceFAQ = ({ 
  category, 
  limit = 5, 
  className = "",
  showVoiceQueries = false 
}: VoiceFAQProps) => {
  const filteredFAQs = category 
    ? VOICE_OPTIMIZED_FAQS.filter(faq => faq.category === category)
    : VOICE_OPTIMIZED_FAQS;
  
  const displayFAQs = filteredFAQs.slice(0, limit);

  if (displayFAQs.length === 0) return null;

  return (
    <section className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Quick answers to common questions
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {displayFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`voice-faq-${index}`}>
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  <div className="flex items-start gap-3 pr-4">
                    <MessageCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-7">
                  <p className="leading-relaxed">{faq.answer}</p>
                  {showVoiceQueries && faq.voiceQuery && (
                    <div className="mt-3 pt-3 border-t">
                      <Badge variant="outline" className="text-xs">
                        <Mic className="w-3 h-3 mr-1" />
                        Voice: "{faq.voiceQuery}"
                      </Badge>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
};

export default VoiceFAQ;
