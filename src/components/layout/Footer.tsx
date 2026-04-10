import { Phone, Send, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Copyright */}
        <div className="text-center mb-6">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} Creative Professional Portfolio. All rights reserved.
          </p>
        </div>
        
        {/* Contact and Social Media */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-center md:gap-16 space-y-6 md:space-y-0">
          {/* Contact Information */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <a href="tel:+251951000092" className="text-sm">
                +251 951 000 092
              </a>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="flex flex-col items-center space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Social Media</h3>
            <div className="flex items-center gap-4">
              {/* Telegram */}
              <a 
                href="https://t.me/Rollmy_heart" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
                title="Telegram: @Rollmy_heart"
              >
                <Send className="h-4 w-4" />
                <span className="text-sm">@Rollmy_heart</span>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://instagram.com/jo_last_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-pink-500 transition-colors"
                title="Instagram: @jo_last_"
              >
                <Instagram className="h-4 w-4" />
                <span className="text-sm">@jo_last_</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}