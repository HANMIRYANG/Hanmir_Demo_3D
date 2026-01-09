export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export interface ProductSpec {
    id: string;
    name: string;
    description: string;
    features: string[];
    icon: string;
}

export interface NavItem {
    label: string;
    href: string;
}