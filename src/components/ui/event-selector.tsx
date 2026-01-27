import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  Calendar, 
  MapPin, 
  TicketIcon,
  Check
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { events, Event } from "@/data/mockData";

interface EventSelectorProps {
  selectedEventId: string | 'all';
  onEventChange: (eventId: string | 'all') => void;
  showAllOption?: boolean;
}

export function EventSelector({ 
  selectedEventId, 
  onEventChange, 
  showAllOption = true 
}: EventSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedEvent = selectedEventId === 'all' 
    ? null 
    : events.find(e => e.id === selectedEventId);

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'upcoming': return 'bg-warning';
      case 'closed': return 'bg-muted';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[200px] justify-start">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            selectedEvent ? getStatusColor(selectedEvent.status) : "bg-primary"
          )} />
          <span className="truncate">
            {selectedEvent ? selectedEvent.name : "Todos los eventos"}
          </span>
          <ChevronDown className="w-4 h-4 ml-auto shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-card border-border" align="start">
        <div className="p-3 border-b border-border">
          <h4 className="font-semibold text-sm">Seleccionar Evento</h4>
          <p className="text-xs text-muted-foreground">Filtra los datos por evento</p>
        </div>
        <div className="p-2 max-h-[300px] overflow-y-auto">
          {showAllOption && (
            <button
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                selectedEventId === 'all' 
                  ? "bg-primary/10 border border-primary/30" 
                  : "hover:bg-card-elevated"
              )}
              onClick={() => {
                onEventChange('all');
                setOpen(false);
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-party flex items-center justify-center">
                <TicketIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Todos los eventos</p>
                <p className="text-xs text-muted-foreground">Ver datos consolidados</p>
              </div>
              {selectedEventId === 'all' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          )}
          
          {events.map((event) => (
            <button
              key={event.id}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors mt-1",
                selectedEventId === event.id 
                  ? "bg-primary/10 border border-primary/30" 
                  : "hover:bg-card-elevated"
              )}
              onClick={() => {
                onEventChange(event.id);
                setOpen(false);
              }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-card-elevated flex items-center justify-center">
                  <TicketIcon className="w-5 h-5 text-primary" />
                </div>
                <div className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-card",
                  getStatusColor(event.status)
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{event.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{event.date}</span>
                  <MapPin className="w-3 h-3 ml-1" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
              {selectedEventId === event.id && (
                <Check className="w-4 h-4 text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {events.length} eventos disponibles
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
