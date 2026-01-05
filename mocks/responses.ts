export const responseTemplates = [
  // 1. Analytical breakdown with bullet points
  `Let me break this down into key components:

- **Core concept**: The fundamental idea here revolves around structuring information hierarchically
- **Primary benefit**: This approach allows for better organization and retrieval
- **Implementation**: You'd typically start with the main topic, then branch into subtopics
- **Considerations**: Keep in mind the depth vs. breadth tradeoff

Each of these aspects contributes to a more comprehensive understanding of the subject.`,

  // 2. Step-by-step explanation
  `Here's a step-by-step approach:

1. **Start with the foundation** - Establish your base understanding of the core concepts
2. **Identify the key variables** - Determine what factors will influence your outcome
3. **Map the relationships** - Understand how different elements interact
4. **Test your assumptions** - Validate each step before proceeding
5. **Iterate and refine** - Use feedback to improve your approach

This methodical process ensures you don't miss critical details.`,

  // 3. Comparison/contrast format
  `Let's compare the two approaches:

| Aspect | Approach A | Approach B |
|--------|-----------|-----------|
| Complexity | Lower initial | Higher initial |
| Scalability | Limited | Excellent |
| Maintenance | Simple | Requires expertise |
| Cost | Lower upfront | Lower long-term |

**Recommendation**: For your use case, Approach B likely offers better long-term value, though Approach A is valid for quick prototypes.`,

  // 4. Summary with key takeaways
  `## Summary

The main points to remember are:

1. **Efficiency matters** - Optimize for the most common use cases first
2. **Flexibility is key** - Build systems that can adapt to changing requirements
3. **Documentation saves time** - Invest in clear documentation early

### Key Takeaways
- Start simple, then add complexity as needed
- Measure before optimizing
- Consider the maintenance burden of each decision`,

  // 5. Elaboration with examples
  `Great question! Let me expand on this with some concrete examples.

**Example 1: E-commerce**
When building a product catalog, you might structure categories hierarchically:
\`\`\`
Electronics → Computers → Laptops → Gaming Laptops
\`\`\`

**Example 2: Content Management**
A blog might organize content as:
\`\`\`
Blog → Category → Post → Comments
\`\`\`

These patterns are applicable across many domains. The key is identifying natural hierarchies in your data.`,

  // 6. Clarifying questions response
  `Based on your question, I want to make sure I understand correctly. It sounds like you're asking about:

1. The **primary mechanism** - how the core functionality works
2. The **edge cases** - what happens in unusual situations
3. The **best practices** - recommended approaches

To give you the most useful answer, could you clarify:
- What's your current implementation?
- Are there specific constraints you're working within?
- What outcome are you optimizing for?`,

  // 7. Code explanation with markdown code blocks
  `Here's how you might implement this:

\`\`\`typescript
interface DataNode {
  id: string;
  parentId: string | null;
  children: DataNode[];
  data: Record<string, unknown>;
}

function traverseTree(node: DataNode, callback: (n: DataNode) => void) {
  callback(node);
  node.children.forEach(child => traverseTree(child, callback));
}
\`\`\`

**Key points about this code:**
- The interface defines a recursive structure
- The \`traverseTree\` function uses recursion to visit every node
- The callback pattern allows flexible operations on each node`,

  // 8. Pros/cons analysis
  `Let's weigh the advantages and disadvantages:

### Pros ✓
- **Improved organization**: Clear structure makes navigation intuitive
- **Better scalability**: Can grow without becoming unwieldy
- **Enhanced collaboration**: Team members can work on isolated branches
- **Easier maintenance**: Changes are localized

### Cons ✗
- **Learning curve**: Takes time to master
- **Initial overhead**: Requires more upfront planning
- **Potential complexity**: Can become over-engineered if not careful

**Bottom line**: The benefits typically outweigh the costs for projects beyond trivial complexity.`,

  // 9. Historical/background context
  `To fully understand this, some context helps:

**Origins**: This concept emerged from early computer science research in the 1960s, when researchers were exploring ways to represent knowledge hierarchically.

**Evolution**: Over decades, the approach has been refined:
- 1970s: Tree structures in databases
- 1990s: DOM and XML hierarchies
- 2000s: Component-based UI architectures
- 2020s: Modern state management patterns

**Current state**: Today's implementations combine these learnings with modern tooling for optimal developer experience.`,

  // 10. Action items / next steps
  `Based on our discussion, here are your next steps:

### Immediate Actions
- [ ] Review the current implementation
- [ ] Identify the main pain points
- [ ] Sketch out the new structure

### Short-term Goals (This Week)
- [ ] Create a proof of concept
- [ ] Get feedback from stakeholders
- [ ] Document the approach

### Medium-term Goals (This Month)
- [ ] Implement the core functionality
- [ ] Write tests
- [ ] Deploy to staging

Would you like me to elaborate on any of these steps?`,
];

export function getRandomResponse(): string {
  return responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
}
