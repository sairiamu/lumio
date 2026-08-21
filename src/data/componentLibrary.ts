export interface ComponentLibraryItem {
  id: string;
  label: string;
  type: string;
  icon: string;
}

export const COMPONENT_LIBRARY: ComponentLibraryItem[] = [
  { id: 'uno', label: 'Arduino Uno', type: 'wokwi-arduino-uno', icon: 'Cpu' },
  { id: 'led', label: 'LED', type: 'wokwi-led', icon: 'Lightbulb' },
  { id: 'resistor', label: 'Resistor', type: 'wokwi-resistor', icon: 'Minus' },
  { id: 'pushbutton', label: 'Pushbutton', type: 'wokwi-pushbutton', icon: 'Circle' },
  { id: 'pot', label: 'Potentiometer', type: 'wokwi-potentiometer', icon: 'RotateCw' },
  { id: 'buzzer', label: 'Buzzer', type: 'wokwi-buzzer', icon: 'Volume2' },
  { id: 'servo', label: 'Servo', type: 'wokwi-servo', icon: 'Activity' },
  { id: 'breadboard', label: 'Breadboard', type: 'wokwi-breadboard', icon: 'Grid' },
];
