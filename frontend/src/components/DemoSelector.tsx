import React from 'react';
import { Terminal, Code2 } from 'lucide-react';

export interface DemoSnippet {
  title: string;
  language: string;
  framework?: string;
  problemType: string;
  input: string;
  expectedBehavior: string;
}

export const DEMO_SNIPPETS: DemoSnippet[] = [
  {
    title: 'Python: TypeError str + float',
    language: 'Python',
    framework: 'FastAPI',
    problemType: 'Runtime Error',
    input: `Traceback (most recent call last):
  File "main.py", line 18, in calculate_total
    total = price + tax
TypeError: can only concatenate str (not "float") to str

def calculate_total(price: str, tax_rate: float):
    tax = price * tax_rate
    total = price + tax
    return total

calculate_total("49.99", 0.08)`,
    expectedBehavior: 'Calculate the total price including tax as a float value.'
  },
  {
    title: 'Spring Boot: NullPointerException in Controller',
    language: 'Java',
    framework: 'Spring Boot',
    problemType: 'Runtime Error',
    input: `java.lang.NullPointerException: Cannot invoke "com.example.service.PaymentService.process(com.example.dto.Order)" because "this.paymentService" is null
	at com.example.controller.OrderController.checkout(OrderController.java:34)
	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)

@RestController
@RequestMapping("/orders")
public class OrderController {

    private PaymentService paymentService; // Missing dependency injection!

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@RequestBody Order order) {
        paymentService.process(order);
        return ResponseEntity.ok("Success");
    }
}`,
    expectedBehavior: 'OrderController should inject PaymentService properly via constructor or @Autowired and process order.'
  },
  {
    title: 'React / Next.js: Invalid Hook Call',
    language: 'TypeScript',
    framework: 'React',
    problemType: 'Runtime Error',
    input: `Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app

function calculateDiscount(price: number) {
  // Breaking Rules of Hooks: useState inside regular helper function!
  const [discount, setDiscount] = useState(0.1);
  return price * (1 - discount);
}`,
    expectedBehavior: 'Calculate the discounted price without invoking hooks in a non-component function.'
  },
  {
    title: 'PostgreSQL / SQL: Syntax error at or near "WHERE"',
    language: 'SQL',
    framework: 'PostgreSQL',
    problemType: 'Database Exception',
    input: `ERROR: syntax error at or near "WHERE"
LINE 3: WHERE department = 'Engineering'
        ^
SELECT department, COUNT(*), AVG(salary)
FROM employees
GROUP BY department
WHERE department = 'Engineering' AND active = true;`,
    expectedBehavior: 'Filter employees before grouping or use HAVING clause correctly.'
  },
  {
    title: 'Rust: Borrow Checker Cannot Borrow as Mutable',
    language: 'Rust',
    framework: 'Standard Library',
    problemType: 'Compiler Error',
    input: `error[E0596]: cannot borrow \`data\` as mutable, as it is not declared as mutable
 --> src/main.rs:4:5
  |
3 |     let data = vec![1, 2, 3];
  |         ---- help: consider changing this to be mutable: \`mut data\`
4 |     data.push(4);
  |     ^^^^^^^^^^^^ cannot borrow as mutable`,
    expectedBehavior: 'Declare data vector as mutable and append item.'
  }
];

interface DemoSelectorProps {
  onSelect: (snippet: DemoSnippet) => void;
}

export const DemoSelector: React.FC<DemoSelectorProps> = ({ onSelect }) => {
  const getBadgeClass = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'java':
        return 'bg-[#F1F5F9] text-[#334155] border-[#E2E8F0]';
      case 'python':
        return 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]';
      case 'typescript':
      case 'javascript':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';
    }
  };

  return (
    <div className="card p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B] shrink-0">
        <Terminal className="w-3.5 h-3.5 text-[#0F766E]" />
        <span>Try Sample Error Dumps:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {DEMO_SNIPPETS.map((snippet, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(snippet)}
            className={`px-2.5 py-1 rounded text-xs font-medium border hover:border-[#0F766E] transition-colors flex items-center gap-1.5 ${getBadgeClass(snippet.language)}`}
          >
            <span className="font-mono text-[10px] uppercase font-bold text-[#64748B]">{snippet.language}</span>
            <span className="truncate max-w-[150px]">{snippet.title.split(':')[1]?.trim() || snippet.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
