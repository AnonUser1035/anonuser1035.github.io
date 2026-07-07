import type { CSSProperties } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

import SkillTag from './Skills/SkillTag';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
}

export default function Skills({ skills, categories }: SkillsProps) {
  // Sort within a group by competency (strongest first), then alphabetically.
  // The score is never shown — it only orders the tags.
  const sorted = [...skills].sort((a, b) => {
    if (a.competency !== b.competency) return b.competency - a.competency;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="skills">
      <div className="title">
        <h2>Skills</h2>
      </div>
      <div className="skill-groups">
        {categories.map((category) => {
          const categorySkills = sorted.filter((skill) =>
            skill.category.includes(category.name),
          );
          if (categorySkills.length === 0) return null;

          const titleStyle = {
            '--group-label-color': category.color,
          } as CSSProperties;

          return (
            <div key={category.name} className="skill-group">
              <h3 className="group-label" style={titleStyle}>
                {category.name}
              </h3>
              <div className="skill-tags">
                {categorySkills.map((skill) => (
                  <SkillTag key={skill.title} data={skill} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
