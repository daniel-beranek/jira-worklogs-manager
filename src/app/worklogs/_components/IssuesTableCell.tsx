import { Button, Divider, Link, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { remark } from 'remark';
import html from 'remark-html';
import { Worklogs } from '@/app/worklogs/actions';

const IssuesTableCell = ({ data }: Readonly<{ data: Worklogs[number] }>) => {
	return data.issues.map((i) => (
		<Popover key={i.key}>
			<PopoverTrigger>
				<Button
					className="mx-1"
					variant="flat"
					size="sm">
					{i.key}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Link
					isExternal
					showAnchorIcon
					href={i.url}>
					{typeof i.name === 'string' ? i.name : i.key}
				</Link>
				{typeof i.description === 'string' && (
					<>
						<Divider />
						<div
							className="prose prose-sm dark:prose-invert"
							dangerouslySetInnerHTML={{
								__html: remark().use(html).processSync(i.description).toString()
							}}
						/>
					</>
				)}
			</PopoverContent>
		</Popover>
	));
};
export default IssuesTableCell;
